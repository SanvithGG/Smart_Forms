package com.smartforms.backend.service;

import com.smartforms.backend.dto.QuestionDtos.*;
import com.smartforms.backend.entity.Question;
import com.smartforms.backend.exception.ApiException;
import com.smartforms.backend.repository.QuestionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
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

    public void delete(String id) {
        questionRepository.deleteById(Objects.requireNonNull(id));
    }
}
