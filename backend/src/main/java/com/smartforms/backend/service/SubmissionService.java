package com.smartforms.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartforms.backend.dto.SubmissionDtos.*;
import com.smartforms.backend.entity.Answer;
import com.smartforms.backend.entity.Branch;
import com.smartforms.backend.entity.Form;
import com.smartforms.backend.entity.FormResponse;
import com.smartforms.backend.exception.ApiException;
import com.smartforms.backend.repository.AnswerRepository;
import com.smartforms.backend.repository.BranchRepository;
import com.smartforms.backend.repository.FormRepository;
import com.smartforms.backend.repository.FormResponseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class SubmissionService {

    private final FormRepository formRepository;
    private final FormResponseRepository formResponseRepository;
    private final AnswerRepository answerRepository;
    private final BranchRepository branchRepository;
    private final BranchConditionEvaluator evaluator;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SubmissionService(FormRepository formRepository,
                              FormResponseRepository formResponseRepository,
                              AnswerRepository answerRepository,
                              BranchRepository branchRepository,
                              BranchConditionEvaluator evaluator) {
        this.formRepository = formRepository;
        this.formResponseRepository = formResponseRepository;
        this.answerRepository = answerRepository;
        this.branchRepository = branchRepository;
        this.evaluator = evaluator;
    }

    @Transactional
    public StartResponseResult start(String formId, StartResponseRequest req) {
        Form form = formRepository.findById(Objects.requireNonNull(formId))
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Form not found"));

        if (form.getStartNodeId() == null) {
            throw new ApiException(HttpStatus.CONFLICT, "Form has no starting question configured");
        }

        FormResponse response = new FormResponse();
        response.setFormId(formId);
        response.setRespondentRef(req != null ? req.respondentRef() : null);
        response = formResponseRepository.save(Objects.requireNonNull(response));

        return new StartResponseResult(response.getId(), form.getStartNodeId());
    }

    @Transactional
    public NextStepResult submitAnswer(String responseId, SubmitAnswerRequest req) {
        FormResponse response = formResponseRepository.findById(Objects.requireNonNull(responseId))
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Response not found"));

        if (response.getStatus() != FormResponse.Status.IN_PROGRESS) {
            throw new ApiException(HttpStatus.CONFLICT, "This response session is no longer in progress");
        }

        // Persist the answer
        Answer answer = new Answer();
        answer.setResponseId(responseId);
        answer.setQuestionId(req.questionId());
        try {
            answer.setValueJson(objectMapper.writeValueAsString(req.value()));
        } catch (JsonProcessingException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Could not serialize answer value");
        }
        answerRepository.save(Objects.requireNonNull(answer));

        // Determine next node by evaluating outgoing branches in priority order
        List<Branch> outgoing = branchRepository.findBySourceQuestionIdOrderByPriorityAsc(req.questionId());

        String nextQuestionId = null;
        boolean matched = false;

        // First pass: conditional edges (non-null condition), in priority order
        for (Branch b : outgoing.stream()
                .filter(b -> b.getConditionJson() != null && !b.getConditionJson().isBlank())
                .sorted(Comparator.comparing(b -> Objects.requireNonNullElse(b.getPriority(), 0)))
                .toList()) {
            if (evaluator.matches(b.getConditionJson(), req.value())) {
                nextQuestionId = b.getTargetQuestionId();
                matched = true;
                break;
            }
        }

        // Second pass: fallback/default edge if nothing matched
        if (!matched) {
            Branch fallback = outgoing.stream()
                    .filter(b -> b.getConditionJson() == null || b.getConditionJson().isBlank())
                    .findFirst()
                    .orElse(null);
            if (fallback != null) {
                nextQuestionId = fallback.getTargetQuestionId();
            }
        }

        boolean completed = nextQuestionId == null;
        if (completed) {
            response.setStatus(FormResponse.Status.COMPLETED);
            response.setCompletedAt(Instant.now());
            formResponseRepository.save(Objects.requireNonNull(response));
        }

        return new NextStepResult(nextQuestionId, completed);
    }

    @Transactional(readOnly = true)
    public ResponseSummaryDto getSummary(String responseId) {
        FormResponse response = formResponseRepository.findById(Objects.requireNonNull(responseId))
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Response not found"));

        List<Answer> answers = answerRepository.findByResponseId(responseId);
        List<Map<String, Object>> answerMaps = answers.stream()
                .map(a -> {
                    Object value;
                    try {
                        value = objectMapper.readValue(a.getValueJson(), Object.class);
                    } catch (JsonProcessingException e) {
                        value = a.getValueJson();
                    }
                    return Map.<String, Object>of(
                            "questionId", a.getQuestionId(),
                            "value", value,
                            "answeredAt", a.getAnsweredAt().toString()
                    );
                })
                .toList();

        return new ResponseSummaryDto(response.getId(), response.getFormId(), response.getStatus().name(), answerMaps);
    }

    @Transactional(readOnly = true)
    public List<ResponseSummaryDto> listSummariesForForm(String formId) {
        List<FormResponse> responses = formResponseRepository.findByFormId(Objects.requireNonNull(formId));
        return responses.stream()
                .map(r -> getSummary(r.getId()))
                .toList();
    }
}
