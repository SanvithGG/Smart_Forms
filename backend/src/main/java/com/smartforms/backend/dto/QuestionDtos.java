package com.smartforms.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class QuestionDtos {

    public record CreateQuestionRequest(
            @NotBlank String formId,
            @NotNull String type,          // MCQ, SHORT_TEXT, LONG_TEXT, RATING, YES_NO, DROPDOWN, NUMBER, DATE
            @NotBlank String title,
            String description,
            boolean required,
            String optionsJson,            // JSON array string, e.g. [{"id":"opt1","label":"Yes"}]
            Double positionX,
            Double positionY,
            Integer orderIndex
    ) {}

    public record UpdateQuestionRequest(
            String type,
            String title,
            String description,
            Boolean required,
            String optionsJson,
            Double positionX,
            Double positionY,
            Integer orderIndex
    ) {}

    public record QuestionResponseDto(
            String id,
            String formId,
            String type,
            String title,
            String description,
            boolean required,
            String optionsJson,
            Double positionX,
            Double positionY,
            Integer orderIndex
    ) {}
}
