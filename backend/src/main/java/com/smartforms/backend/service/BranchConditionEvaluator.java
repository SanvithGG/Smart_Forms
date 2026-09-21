package com.smartforms.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

/**
 * Evaluates a branch's conditionJson against an answer value to decide whether that edge should be taken.
 *
 * Supported condition shapes (all fields besides "operator" are optional depending on operator):
 *   {"operator":"equals","optionId":"opt1"}          -> answer (single choice) equals this option id
 *   {"operator":"equals","value":"some text"}        -> answer equals this literal value
 *   {"operator":"contains","optionId":"opt2"}        -> answer (multi choice array) contains this option id
 *   {"operator":"gt","value":5}                      -> numeric answer greater than value
 *   {"operator":"gte","value":5}
 *   {"operator":"lt","value":5}
 *   {"operator":"lte","value":5}
 *   {"operator":"not_empty"}                         -> answer is present and non-empty
 *   null / {}                                        -> default/fallback edge, always matches
 */
@Component
public class BranchConditionEvaluator {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean matches(String conditionJson, Object answerValue) {
        if (conditionJson == null || conditionJson.isBlank()) {
            return true; // default/fallback edge
        }

        try {
            JsonNode condition = objectMapper.readTree(conditionJson);
            String operator = condition.path("operator").asText("");

            return switch (operator) {
                case "equals" -> matchesEquals(condition, answerValue);
                case "contains" -> matchesContains(condition, answerValue);
                case "gt" -> compareNumeric(condition, answerValue) > 0;
                case "gte" -> compareNumeric(condition, answerValue) >= 0;
                case "lt" -> compareNumeric(condition, answerValue) < 0;
                case "lte" -> compareNumeric(condition, answerValue) <= 0;
                case "not_empty" -> answerValue != null && !answerValue.toString().isBlank();
                default -> false;
            };
        } catch (Exception e) {
            // Malformed condition never matches; the default edge (if any) will catch it.
            return false;
        }
    }

    private boolean matchesEquals(JsonNode condition, Object answerValue) {
        if (answerValue == null) return false;
        String expected = condition.has("optionId")
                ? condition.get("optionId").asText()
                : condition.path("value").asText();
        return expected.equals(String.valueOf(answerValue));
    }

    private boolean matchesContains(JsonNode condition, Object answerValue) {
        if (!(answerValue instanceof Iterable<?> iterable)) return false;
        String expected = condition.path("optionId").asText();
        for (Object item : iterable) {
            if (expected.equals(String.valueOf(item))) return true;
        }
        return false;
    }

    private double compareNumeric(JsonNode condition, Object answerValue) {
        double expected = condition.path("value").asDouble();
        double actual = Double.parseDouble(String.valueOf(answerValue));
        return Double.compare(actual, expected);
    }
}
