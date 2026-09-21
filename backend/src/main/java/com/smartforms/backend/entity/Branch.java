package com.smartforms.backend.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

/**
 * An edge in the form's branching DAG.
 * If conditionJson is null, this is the default/fallback edge for the source question.
 * If targetQuestionId is null, taking this edge ends the form.
 */
@Entity
@Table(name = "branches")
public class Branch {

    @Id
    private String id;

    @Column(name = "form_id", nullable = false)
    private String formId;

    @Column(name = "source_question_id", nullable = false)
    private String sourceQuestionId;

    @Column(name = "target_question_id")
    private String targetQuestionId;

    /** JSON, e.g. {"operator":"equals","optionId":"opt1"} or {"operator":"gt","value":5}. Null = default edge. */
    @Column(name = "condition_json", columnDefinition = "TEXT")
    private String conditionJson;

    @Column(nullable = false)
    private Integer priority = 0;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    public Branch() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFormId() { return formId; }
    public void setFormId(String formId) { this.formId = formId; }

    public String getSourceQuestionId() { return sourceQuestionId; }
    public void setSourceQuestionId(String sourceQuestionId) { this.sourceQuestionId = sourceQuestionId; }

    public String getTargetQuestionId() { return targetQuestionId; }
    public void setTargetQuestionId(String targetQuestionId) { this.targetQuestionId = targetQuestionId; }

    public String getConditionJson() { return conditionJson; }
    public void setConditionJson(String conditionJson) { this.conditionJson = conditionJson; }

    public Integer getPriority() { return priority; }
    public void setPriority(Integer priority) { this.priority = priority; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    @PrePersist
    public void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
        createdAt = Instant.now();
    }
}
