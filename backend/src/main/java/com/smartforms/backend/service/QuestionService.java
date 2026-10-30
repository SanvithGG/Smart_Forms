package com.smartforms.backend.service;

import com.smartforms.backend.dto.QuestionDtos.*;
import com.smartforms.backend.entity.Form;
import com.smartforms.backend.entity.Question;
import com.smartforms.backend.exception.ApiException;
import com.smartforms.backend.repository.AnswerRepository;
import com.smartforms.backend.repository.BranchRepository;
import com.smartforms.backend.repository.FormRepository;
import com.smartforms.backend.repository.QuestionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final BranchRepository branchRepository;
    private final FormRepository formRepository;

    public QuestionService(QuestionRepository questionRepository,
                           AnswerRepository answerRepository,
                           BranchRepository branchRepository,
                           FormRepository formRepository) {
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.branchRepository = branchRepository;
        this.formRepository = formRepository;
    }

    public Question create(CreateQuestionRequest req) {
        Question q = new Question();
        q.setFormId(req.formId());
        q.setType(Question.Type.valueOf(req.type()));
        q.setTitle(req.title());
        q.setDescription(req.description());
        q.setRequired(req.required());
        q.setOptionsJson(req.optionsJson());
        if (req.positionX() != null) q.setPositionX(req.positionX());
        if (req.positionY() != null) q.setPositionY(req.positionY());
        if (req.orderIndex() != null) q.setOrderIndex(req.orderIndex());
        return questionRepository.save(Objects.requireNonNull(q));
    }

    public Question get(String id) {
        return questionRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Question not found"));
    }

    public List<Question> listForForm(String formId) {
        return questionRepository.findByFormIdOrderByOrderIndexAsc(formId);
    }

    public Question update(String id, UpdateQuestionRequest req) {
        Question q = get(id);
        if (req.type() != null) q.setType(Question.Type.valueOf(req.type()));
        if (req.title() != null) q.setTitle(req.title());
        if (req.description() != null) q.setDescription(req.description());
        if (req.required() != null) q.setRequired(req.required());
        if (req.optionsJson() != null) q.setOptionsJson(req.optionsJson());
        if (req.positionX() != null) q.setPositionX(req.positionX());
        if (req.positionY() != null) q.setPositionY(req.positionY());
        if (req.orderIndex() != null) q.setOrderIndex(req.orderIndex());
        return questionRepository.save(Objects.requireNonNull(q));
    }

    @Transactional
    public void delete(String id) {
        Objects.requireNonNull(id, "Question ID cannot be null");
        Question question = questionRepository.findById(id).orElse(null);
        if (question == null) {
            return;
        }

        // If this question is the form's startNodeId, reassign or clear startNodeId
        Form form = formRepository.findById(question.getFormId()).orElse(null);
        if (form != null && id.equals(form.getStartNodeId())) {
            List<Question> remaining = questionRepository.findByFormIdOrderByOrderIndexAsc(form.getId())
                    .stream()
                    .filter(q -> !q.getId().equals(id))
                    .toList();
            form.setStartNodeId(remaining.isEmpty() ? null : remaining.get(0).getId());
            formRepository.saveAndFlush(form);
        }

        // Cascade delete answers and branches referencing this question
        answerRepository.deleteByQuestionId(id);
        branchRepository.deleteByQuestionId(id);

        questionRepository.delete(question);
    }
}
