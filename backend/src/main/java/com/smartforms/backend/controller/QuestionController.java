package com.smartforms.backend.controller;

import com.smartforms.backend.dto.QuestionDtos.*;
import com.smartforms.backend.entity.Question;
import com.smartforms.backend.service.QuestionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @PostMapping
    public Question create(@Valid @RequestBody CreateQuestionRequest req) {
        return questionService.create(req);
    }

    @GetMapping
    public List<Question> listForForm(@RequestParam String formId) {
        return questionService.listForForm(formId);
    }

    @GetMapping("/{id}")
    public Question get(@PathVariable String id) {
        return questionService.get(id);
    }

    @PutMapping("/{id}")
    public Question update(@PathVariable String id, @RequestBody UpdateQuestionRequest req) {
        return questionService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        questionService.delete(id);
    }
}
