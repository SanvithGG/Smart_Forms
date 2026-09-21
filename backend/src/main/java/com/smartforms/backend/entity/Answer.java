package com.smartforms.backend.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "answers")
public class Answer {

    @Id
    private String id;

    @Column(name = "response_id", nullable = false)
    private String responseId;

    @Column(name = "question_id", nullable = false)
    private String questionId;

    /** JSON-encoded value, shape depends on question type, e.g. "\"Yes\"" or "[\"opt1\"]" or "4" */
    @Column(name = "value_json", nullable = false, columnDefinition = "TEXT")
    private String valueJson;

    @Column(name = "answered_at", nullable = false)
    private Instant answeredAt;

    public Answer() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getResponseId() { return responseId; }
    public void setResponseId(String responseId) { this.responseId = responseId; }

    public String getQuestionId() { return questionId; }
    public void setQuestionId(String questionId) { this.questionId = questionId; }

    public String getValueJson() { return valueJson; }
    public void setValueJson(String valueJson) { this.valueJson = valueJson; }

    public Instant getAnsweredAt() { return answeredAt; }
    public void setAnsweredAt(Instant answeredAt) { this.answeredAt = answeredAt; }

    @PrePersist
    public void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
        answeredAt = Instant.now();
    }
}
