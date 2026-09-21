package com.smartforms.backend.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "form_responses")
public class FormResponse {

    public enum Status { IN_PROGRESS, COMPLETED, ABANDONED }

    @Id
    private String id;

    @Column(name = "form_id", nullable = false)
    private String formId;

    @Column(name = "respondent_ref")
    private String respondentRef;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.IN_PROGRESS;

    public FormResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFormId() { return formId; }
    public void setFormId(String formId) { this.formId = formId; }

    public String getRespondentRef() { return respondentRef; }
    public void setRespondentRef(String respondentRef) { this.respondentRef = respondentRef; }

    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    @PrePersist
    public void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
        startedAt = Instant.now();
    }
}
