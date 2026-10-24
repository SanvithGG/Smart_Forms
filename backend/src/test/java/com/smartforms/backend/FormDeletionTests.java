package com.smartforms.backend;

import com.smartforms.backend.dto.FormDtos.CreateFormRequest;
import com.smartforms.backend.dto.QuestionDtos.CreateQuestionRequest;
import com.smartforms.backend.dto.SubmissionDtos.StartResponseRequest;
import com.smartforms.backend.dto.SubmissionDtos.SubmitAnswerRequest;
import com.smartforms.backend.entity.Form;
import com.smartforms.backend.entity.Question;
import com.smartforms.backend.service.FormService;
import com.smartforms.backend.service.QuestionService;
import com.smartforms.backend.service.SubmissionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

@SpringBootTest
@ActiveProfiles("test")
class FormDeletionTests {

    @Autowired
    private FormService formService;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private SubmissionService submissionService;

    @Test
    void testDeleteFormWithResponsesAndAnswersSucceeds() {
        Form form = formService.create(new CreateFormRequest(null, "Test Cascade Form", "Testing cascade delete"));
        
        Question question = questionService.create(new CreateQuestionRequest(
                form.getId(), "MCQ", "Favorite Color?", null, true,
                "[{\"id\":\"1\",\"label\":\"Red\"},{\"id\":\"2\",\"label\":\"Blue\"}]",
                100.0, 100.0, 0
        ));

        formService.update(form.getId(), new com.smartforms.backend.dto.FormDtos.UpdateFormRequest(
                null, null, "PUBLISHED", question.getId()
        ));

        var startResult = submissionService.start(form.getId(), new StartResponseRequest("respondent-123"));
        submissionService.submitAnswer(startResult.responseId(), new SubmitAnswerRequest(question.getId(), "Red"));

        // Deleting the form should cascade delete responses and answers without foreign key violation
        assertDoesNotThrow(() -> formService.delete(form.getId()));
    }
}
