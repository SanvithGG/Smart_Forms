package com.smartforms.backend.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public class FormDtos {

    public record CreateFormRequest(
            @NotBlank String workspaceId,
            @NotBlank String title,
            String description
    ) {}

    public record UpdateFormRequest(
            String title,
            String description,
            String status,       // DRAFT, PUBLISHED, ARCHIVED
            String startNodeId
    ) {}

    public record FormResponseDto(
            String id,
            String workspaceId,
            String title,
            String description,
            String status,
            String startNodeId
    ) {}

    public record FormWithGraphDto(
            FormResponseDto form,
            List<QuestionDtos.QuestionResponseDto> questions,
            List<BranchDtos.BranchResponseDto> branches
    ) {}
}
