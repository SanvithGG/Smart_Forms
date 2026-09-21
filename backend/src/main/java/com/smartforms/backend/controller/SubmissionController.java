package com.smartforms.backend.controller;

import com.smartforms.backend.dto.SubmissionDtos.*;
import com.smartforms.backend.service.SubmissionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/**
 * Public-facing endpoints used by form respondents (no auth required) to walk through
 * a published form's branching logic one question at a time.
 */
@RestController
@RequestMapping("/api/public/forms")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @PostMapping("/{formId}/responses")
    public StartResponseResult start(@PathVariable String formId, @RequestBody(required = false) StartResponseRequest req) {
        return submissionService.start(formId, req);
    }

    @PostMapping("/responses/{responseId}/answers")
    public NextStepResult submitAnswer(@PathVariable String responseId, @Valid @RequestBody SubmitAnswerRequest req) {
        return submissionService.submitAnswer(responseId, req);
    }

    @GetMapping("/responses/{responseId}")
    public ResponseSummaryDto getSummary(@PathVariable String responseId) {
        return submissionService.getSummary(responseId);
    }

    @GetMapping("/{formId}/all-responses")
    public java.util.List<ResponseSummaryDto> listAllResponses(@PathVariable String formId) {
        return submissionService.listSummariesForForm(formId);
    }
}
