package com.smartforms.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class BranchDtos {

    public record CreateBranchRequest(
            @NotBlank String formId,
            @NotBlank String sourceQuestionId,
            String targetQuestionId,        // null = ends the form
            String conditionJson,           // null = default/fallback edge
            Integer priority
    ) {}

    public record BranchResponseDto(
            String id,
            String formId,
            String sourceQuestionId,
            String targetQuestionId,
            String conditionJson,
            Integer priority
    ) {}
}
