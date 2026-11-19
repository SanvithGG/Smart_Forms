package com.smartforms.backend;

import com.smartforms.backend.dto.FormDtos.CreateFormRequest;
import com.smartforms.backend.dto.FormDtos.UpdateFormRequest;
import com.smartforms.backend.dto.QuestionDtos.CreateQuestionRequest;
import com.smartforms.backend.dto.SubmissionDtos.ResponseSummaryDto;
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

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class SubmissionTests {

    @Autowired
    private FormService formService;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private SubmissionService submissionService;

    @Autowired
    private com.smartforms.backend.service.BranchService branchService;

    @Test
    void testSubmitAndGetSummaryWithNullValueSucceeds() {
        Form form = formService.create(new CreateFormRequest(null, "Optional Answer Form", "Testing null answer values"));

        Question question = questionService.create(new CreateQuestionRequest(
                form.getId(), "SHORT_TEXT", "Optional Feedback", null, false,
                null, 100.0, 100.0, 0
        ));

        formService.update(form.getId(), new UpdateFormRequest(
                null, null, "PUBLISHED", question.getId()
        ));

        var startResult = submissionService.start(form.getId(), new StartResponseRequest("anon-user-1"));

        // Submitting null value should succeed without error
        assertDoesNotThrow(() -> submissionService.submitAnswer(
                startResult.responseId(), new SubmitAnswerRequest(question.getId(), null)
        ));

        // getSummary and listSummariesForForm should not throw NullPointerException on null value
        ResponseSummaryDto summary = assertDoesNotThrow(() -> submissionService.getSummary(startResult.responseId()));
        assertNotNull(summary);
        assertEquals(1, summary.answers().size());
        assertEquals(question.getId(), summary.answers().get(0).get("questionId"));
        assertNull(summary.answers().get(0).get("value"));

        List<ResponseSummaryDto> allSummaries = assertDoesNotThrow(() -> submissionService.listSummariesForForm(form.getId()));
        assertFalse(allSummaries.isEmpty());
    }

    @Test
    void testReSubmitAnswerUpdatesExistingAnswerWithoutDuplicates() {
        Form form = formService.create(new CreateFormRequest(null, "Re-submit Answer Form", "Testing answer updating"));

        Question q1 = questionService.create(new CreateQuestionRequest(
                form.getId(), "MCQ", "Choose favorite framework", null, true,
                "[{\"id\":\"1\",\"label\":\"React\"},{\"id\":\"2\",\"label\":\"Vue\"}]",
                100.0, 100.0, 0
        ));

        Question q2 = questionService.create(new CreateQuestionRequest(
                form.getId(), "MCQ", "Next question", null, true,
                "[{\"id\":\"1\",\"label\":\"Yes\"}]",
                200.0, 100.0, 1
        ));

        // Create fallback branch from q1 to q2 so session stays in progress
        branchService.create(new com.smartforms.backend.dto.BranchDtos.CreateBranchRequest(
                form.getId(), q1.getId(), q2.getId(), null, 0
        ));

        formService.update(form.getId(), new UpdateFormRequest(
                null, null, "PUBLISHED", q1.getId()
        ));

        var startResult = submissionService.start(form.getId(), new StartResponseRequest("anon-user-2"));

        // Initial submission for q1
        var nextStep1 = submissionService.submitAnswer(startResult.responseId(), new SubmitAnswerRequest(q1.getId(), "1"));
        assertFalse(nextStep1.completed());
        assertEquals(q2.getId(), nextStep1.nextQuestionId());

        ResponseSummaryDto summary1 = submissionService.getSummary(startResult.responseId());
        assertEquals(1, summary1.answers().size());
        assertEquals("1", summary1.answers().get(0).get("value"));

        // Re-submitting for the same question q1 while session is in progress should update the answer, not duplicate it
        var nextStep2 = submissionService.submitAnswer(startResult.responseId(), new SubmitAnswerRequest(q1.getId(), "2"));
        assertFalse(nextStep2.completed());

        ResponseSummaryDto summary2 = submissionService.getSummary(startResult.responseId());
        assertEquals(1, summary2.answers().size(), "There should only be 1 answer for this question");
        assertEquals("2", summary2.answers().get(0).get("value"), "The answer value should be updated to '2'");
    }
}
