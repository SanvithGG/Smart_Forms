# Smart Forms — Backend

Spring Boot 3 / Java 17 backend for Smart Forms, a form builder with a branching-logic
canvas. Models forms as a DAG: `Question` nodes connected by `Branch` edges, where each
edge can carry a condition (e.g. "if answer == 'Yes'") evaluated against the respondent's
answer to decide which question comes next.

## Stack

- Java 17, Spring Boot 3.3
- Spring Web, Spring Data JPA, Spring Security (JWT, stateless)
- PostgreSQL in production, H2 file-based DB for local dev (zero setup)
- Flyway for schema migrations

## Run locally (no Postgres needed)

```bash
./mvnw spring-boot:run
```

Runs on `http://localhost:8080` using the `local` profile (H2, file-based at `./data/smartforms`).
H2 console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/smartforms`).

## Run against Postgres (prod-like)

Set env vars and activate the `prod` profile:

```bash
export DATABASE_URL=jdbc:postgresql://<host>:5432/<db>
export DATABASE_USERNAME=<user>
export DATABASE_PASSWORD=<password>
export JWT_SECRET=$(openssl rand -base64 32)
export CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app

./mvnw spring-boot:run -Dspring-boot.run.profiles=prod
```

## Deploying to Render

1. New Web Service → connect this repo.
2. Build command: `./mvnw clean package -DskipTests`
3. Start command: `java -jar target/smartforms-backend-0.1.0.jar`
4. Environment: `SPRING_PROFILES_ACTIVE=prod`, plus `DATABASE_URL`, `DATABASE_USERNAME`,
   `DATABASE_PASSWORD`, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS` (add a free Postgres instance
   on Render or use Neon/Supabase and paste its connection string in).

## Data model

- `User` — auth
- `Workspace` — owned by a user, groups forms
- `Form` — has a `startNodeId` pointing at the first `Question`
- `Question` — a node in the DAG (MCQ, SHORT_TEXT, LONG_TEXT, RATING, YES_NO, DROPDOWN, NUMBER, DATE), with canvas `positionX/positionY`
- `Branch` — a directed edge `sourceQuestionId -> targetQuestionId` with an optional
  `conditionJson`. `targetQuestionId = null` means "end the form here". `conditionJson = null`
  means "default/fallback edge" (taken when no conditional edge matches).
- `FormResponse` / `Answer` — one response session per respondent, with an answer per question.

### Branch condition format

```json
{"operator": "equals", "optionId": "opt_yes"}
{"operator": "equals", "value": "some text"}
{"operator": "contains", "optionId": "opt_2"}
{"operator": "gt", "value": 5}
{"operator": "gte", "value": 5}
{"operator": "lt", "value": 5}
{"operator": "lte", "value": 5}
{"operator": "not_empty"}
```

Multiple conditional edges can leave the same question; they're evaluated in `priority`
order (lowest first), and the first match wins. If none match, the edge with
`conditionJson = null` (if present) is taken as the fallback.

## API overview

Auth (public):
- `POST /api/auth/register` `{email, password, displayName}` → `{token, ...}`
- `POST /api/auth/login` `{email, password}` → `{token, ...}`

Authenticated (send `Authorization: Bearer <token>`):
- `POST /api/workspaces` `{name}`
- `GET  /api/workspaces`
- `POST /api/forms` `{workspaceId, title, description}`
- `GET  /api/forms?workspaceId=...`
- `GET  /api/forms/{id}/graph` — form + all questions + all branches (what the canvas editor loads)
- `PUT  /api/forms/{id}` `{title?, description?, status?, startNodeId?}`
- `POST /api/questions` `{formId, type, title, description?, required, optionsJson?, positionX?, positionY?, orderIndex?}`
- `PUT  /api/questions/{id}`
- `POST /api/branches` `{formId, sourceQuestionId, targetQuestionId?, conditionJson?, priority?}`
- `DELETE /api/branches/{id}`

Public respondent flow (no auth — used by the live form a respondent fills out):
- `POST /api/public/forms/{formId}/responses` `{respondentRef?}` → `{responseId, firstQuestionId}`
- `POST /api/public/forms/responses/{responseId}/answers` `{questionId, value}` → `{nextQuestionId, completed}`
- `GET  /api/public/forms/responses/{responseId}` → full response summary

## Example: registering, creating a 2-question branching form

```bash
# 1. Register
curl -s localhost:8080/api/auth/register -H 'Content-Type: application/json' -d '{
  "email":"rex@example.com","password":"password123","displayName":"Rex"
}' | tee /tmp/auth.json

TOKEN=$(jq -r .token /tmp/auth.json)

# 2. Create a workspace
WS=$(curl -s localhost:8080/api/workspaces -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' -d '{"name":"My Workspace"}' | jq -r .id)

# 3. Create a form
FORM=$(curl -s localhost:8080/api/forms -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' -d "{\"workspaceId\":\"$WS\",\"title\":\"Feedback\"}" | jq -r .id)

# 4. Add questions
Q1=$(curl -s localhost:8080/api/questions -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d "{
  \"formId\":\"$FORM\",\"type\":\"YES_NO\",\"title\":\"Did you enjoy the product?\",\"required\":true
}" | jq -r .id)

Q2=$(curl -s localhost:8080/api/questions -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d "{
  \"formId\":\"$FORM\",\"type\":\"LONG_TEXT\",\"title\":\"What did you love about it?\"
}" | jq -r .id)

Q3=$(curl -s localhost:8080/api/questions -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d "{
  \"formId\":\"$FORM\",\"type\":\"LONG_TEXT\",\"title\":\"What can we improve?\"
}" | jq -r .id)

# 5. Wire branching: Yes -> Q2, No -> Q3
curl -s localhost:8080/api/branches -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d "{
  \"formId\":\"$FORM\",\"sourceQuestionId\":\"$Q1\",\"targetQuestionId\":\"$Q2\",
  \"conditionJson\":\"{\\\"operator\\\":\\\"equals\\\",\\\"value\\\":\\\"yes\\\"}\"
}"
curl -s localhost:8080/api/branches -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d "{
  \"formId\":\"$FORM\",\"sourceQuestionId\":\"$Q1\",\"targetQuestionId\":\"$Q3\",\"conditionJson\":null
}"

# 6. Set the start node and publish
curl -s -X PUT localhost:8080/api/forms/$FORM -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d "{\"startNodeId\":\"$Q1\",\"status\":\"PUBLISHED\"}"
```

A respondent then just calls the public endpoints in order — no auth, no knowledge of the
branching structure required; the backend tells them where to go next after each answer.
