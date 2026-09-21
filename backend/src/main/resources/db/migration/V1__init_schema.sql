-- Users
CREATE TABLE users (
    id              VARCHAR(36) PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    display_name    VARCHAR(255) NOT NULL,
    created_at      TIMESTAMP NOT NULL,
    updated_at      TIMESTAMP NOT NULL
);

-- Workspaces (a user can belong to / own workspaces)
CREATE TABLE workspaces (
    id              VARCHAR(36) PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    owner_id        VARCHAR(36) NOT NULL REFERENCES users(id),
    created_at      TIMESTAMP NOT NULL,
    updated_at      TIMESTAMP NOT NULL
);

-- Forms (top-level form/quiz/survey)
CREATE TABLE forms (
    id              VARCHAR(36) PRIMARY KEY,
    workspace_id    VARCHAR(36) NOT NULL REFERENCES workspaces(id),
    title           VARCHAR(255) NOT NULL,
    description     VARCHAR(2000),
    status          VARCHAR(20) NOT NULL DEFAULT 'DRAFT',   -- DRAFT, PUBLISHED, ARCHIVED
    start_node_id   VARCHAR(36),                            -- FK to questions.id, nullable until first node set
    created_at      TIMESTAMP NOT NULL,
    updated_at      TIMESTAMP NOT NULL
);

-- Questions / nodes in the branching DAG
CREATE TABLE questions (
    id              VARCHAR(36) PRIMARY KEY,
    form_id         VARCHAR(36) NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    type            VARCHAR(30) NOT NULL,      -- MCQ, SHORT_TEXT, LONG_TEXT, RATING, YES_NO, etc.
    title           VARCHAR(1000) NOT NULL,
    description     VARCHAR(2000),
    required        BOOLEAN NOT NULL DEFAULT FALSE,
    options_json    TEXT,                      -- JSON array of {id, label} for choice-based questions
    position_x      DOUBLE PRECISION DEFAULT 0, -- canvas layout position
    position_y      DOUBLE PRECISION DEFAULT 0,
    order_index     INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL,
    updated_at      TIMESTAMP NOT NULL
);

-- Edges: branching logic between questions.
-- A default edge (condition_json = NULL) is the fallback "otherwise go here" path.
CREATE TABLE branches (
    id                  VARCHAR(36) PRIMARY KEY,
    form_id             VARCHAR(36) NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    source_question_id  VARCHAR(36) NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    target_question_id  VARCHAR(36) REFERENCES questions(id) ON DELETE CASCADE, -- NULL = end of form
    condition_json      TEXT,                  -- JSON: {"operator":"equals","optionId":"..."} etc. NULL = default/fallback edge
    priority            INT NOT NULL DEFAULT 0, -- lower = evaluated first
    created_at          TIMESTAMP NOT NULL
);

-- A single response session to a form
CREATE TABLE form_responses (
    id              VARCHAR(36) PRIMARY KEY,
    form_id         VARCHAR(36) NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    respondent_ref  VARCHAR(255),              -- optional external id / email / anon token
    started_at      TIMESTAMP NOT NULL,
    completed_at    TIMESTAMP,
    status          VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS' -- IN_PROGRESS, COMPLETED, ABANDONED
);

-- Individual answers within a response
CREATE TABLE answers (
    id              VARCHAR(36) PRIMARY KEY,
    response_id     VARCHAR(36) NOT NULL REFERENCES form_responses(id) ON DELETE CASCADE,
    question_id     VARCHAR(36) NOT NULL REFERENCES questions(id),
    value_json      TEXT NOT NULL,             -- JSON encoded answer value
    answered_at     TIMESTAMP NOT NULL
);

CREATE INDEX idx_questions_form ON questions(form_id);
CREATE INDEX idx_branches_form ON branches(form_id);
CREATE INDEX idx_branches_source ON branches(source_question_id);
CREATE INDEX idx_responses_form ON form_responses(form_id);
CREATE INDEX idx_answers_response ON answers(response_id);
