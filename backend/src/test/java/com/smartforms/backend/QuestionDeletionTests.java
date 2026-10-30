package com.smartforms.backend;

import com.smartforms.backend.dto.BranchDtos.CreateBranchRequest;
import com.smartforms.backend.dto.FormDtos.CreateFormRequest;
import com.smartforms.backend.dto.FormDtos.UpdateFormRequest;
import com.smartforms.backend.dto.QuestionDtos.CreateQuestionRequest;
import com.smartforms.backend.dto.SubmissionDtos.StartResponseRequest;
import com.smartforms.backend.dto.SubmissionDtos.SubmitAnswerRequest;
import com.smartforms.backend.entity.Form;
import com.smartforms.backend.entity.Question;
import com.smartforms.backend.service.BranchService;
import com.smartforms.backend.service.FormService;
import com.smartforms.backend.service.QuestionService;
import com.smartforms.backend.service.SubmissionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("test")
class QuestionDeletionTests {

    @Autowired
    private FormService formService;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private BranchService branchService;

    @Autowired
    private SubmissionService submissionService;

    @Test
    void testDeleteQuestionWithAnswersAndBranchesSucceeds() {
        Form form = formService.create(new CreateFormRequest(null, "Test Question Cascade Form", "Testing cascade delete on question"));

        Question q1 = questionService.create(new CreateQuestionRequest(
                form.getId(), "MCQ", "Question 1", null, true,
                "[{\"id\":\"1\",\"label\":\"A\"},{\"id\":\"2\",\"label\":\"B\"}]",
                100.0, 100.0, 0
        ));
        Question q2 = questionService.create(new CreateQuestionRequest(
                form.getId(), "MCQ", "Question 2", null, true,
                "[{\"id\":\"1\",\"label\":\"C\"}]",
                200.0, 100.0, 1
        ));

        formService.update(form.getId(), new UpdateFormRequest(
                null, null, "PUBLISHED", q1.getId()
        ));

        branchService.create(new CreateBranchRequest(
                form.getId(), q1.getId(), q2.getId(), "{\"operator\":\"equals\",\"optionId\":\"1\"}", 0
        ));

        var startResult = submissionService.start(form.getId(), new StartResponseRequest("respondent-cascade-test"));
        submissionService.submitAnswer(startResult.responseId(), new SubmitAnswerRequest(q1.getId(), "1"));

        // Deleting q1 should cascade delete its answers, remove its branches, and update the form's startNodeId without FK violation
        assertDoesNotThrow(() -> questionService.delete(q1.getId()));

        Form updatedForm = formService.get(form.getId());
        assertEquals(q2.getId(), updatedForm.getStartNodeId());
    }
}
