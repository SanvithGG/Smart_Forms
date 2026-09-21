package com.smartforms.backend.service;

import com.smartforms.backend.dto.BranchDtos;
import com.smartforms.backend.dto.FormDtos.*;
import com.smartforms.backend.dto.QuestionDtos;
import com.smartforms.backend.entity.Branch;
import com.smartforms.backend.entity.Form;
import com.smartforms.backend.entity.Question;
import com.smartforms.backend.exception.ApiException;
import com.smartforms.backend.repository.BranchRepository;
import com.smartforms.backend.repository.FormRepository;
import com.smartforms.backend.repository.QuestionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@Service
public class FormService {

    private final FormRepository formRepository;
    private final QuestionRepository questionRepository;
    private final BranchRepository branchRepository;

    public FormService(FormRepository formRepository, QuestionRepository questionRepository, BranchRepository branchRepository) {
        this.formRepository = formRepository;
        this.questionRepository = questionRepository;
        this.branchRepository = branchRepository;
    }

    public Form create(CreateFormRequest req) {
        Form form = new Form();
        form.setWorkspaceId(req.workspaceId());
        form.setTitle(req.title());
        form.setDescription(req.description());
        return formRepository.save(Objects.requireNonNull(form));
    }

    public Form get(String id) {
        return formRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Form not found"));
    }

    public List<Form> listForWorkspace(String workspaceId) {
        return formRepository.findByWorkspaceId(workspaceId);
    }

    public Form update(String id, UpdateFormRequest req) {
        Form form = get(id);
        if (req.title() != null) form.setTitle(req.title());
        if (req.description() != null) form.setDescription(req.description());
        if (req.status() != null) form.setStatus(Form.Status.valueOf(req.status()));
        if (req.startNodeId() != null) form.setStartNodeId(req.startNodeId());
        return formRepository.save(Objects.requireNonNull(form));
    }

    @Transactional
    public void delete(String id) {
        branchRepository.deleteByFormId(id);
        questionRepository.deleteByFormId(id);
        formRepository.deleteById(Objects.requireNonNull(id));
    }

    @Transactional(readOnly = true)
    public FormWithGraphDto getWithGraph(String id) {
        Form form = get(id);
        List<Question> questions = questionRepository.findByFormIdOrderByOrderIndexAsc(id);
        List<Branch> branches = branchRepository.findByFormId(id);

        List<QuestionDtos.QuestionResponseDto> questionDtos = questions.stream()
                .sorted(Comparator.comparing(q -> Objects.requireNonNullElse(q.getOrderIndex(), 0)))
                .map(this::toQuestionDto)
                .toList();

        List<BranchDtos.BranchResponseDto> branchDtos = branches.stream()
                .map(this::toBranchDto)
                .toList();

        return new FormWithGraphDto(toFormDto(form), questionDtos, branchDtos);
    }

    public FormResponseDto toFormDto(Form form) {
        return new FormResponseDto(
                form.getId(), form.getWorkspaceId(), form.getTitle(), form.getDescription(),
                form.getStatus().name(), form.getStartNodeId()
        );
    }

    private QuestionDtos.QuestionResponseDto toQuestionDto(Question q) {
        return new QuestionDtos.QuestionResponseDto(
                q.getId(), q.getFormId(), q.getType().name(), q.getTitle(), q.getDescription(),
                q.isRequired(), q.getOptionsJson(), q.getPositionX(), q.getPositionY(), q.getOrderIndex()
        );
    }

    private BranchDtos.BranchResponseDto toBranchDto(Branch b) {
        return new BranchDtos.BranchResponseDto(
                b.getId(), b.getFormId(), b.getSourceQuestionId(), b.getTargetQuestionId(),
                b.getConditionJson(), b.getPriority()
        );
    }
}
