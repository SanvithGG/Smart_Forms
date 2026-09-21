package com.smartforms.backend.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;
import java.util.Map;

public class SubmissionDtos {

    public record StartResponseRequest(
            String respondentRef
    ) {}

    public record StartResponseResult(
            String responseId,
            String firstQuestionId
    ) {}

    public record SubmitAnswerRequest(
            @NotBlank String questionId,
            Object value                    // arbitrary JSON-serializable answer value
    ) {}

    /** Tells the client where to go next, or that the form is complete. */
    public record NextStepResult(
            String nextQuestionId,          // null if form is complete
            boolean completed
    ) {}

    public record ResponseSummaryDto(
            String responseId,
            String formId,
            String status,
            List<Map<String, Object>> answers
    ) {}
}
