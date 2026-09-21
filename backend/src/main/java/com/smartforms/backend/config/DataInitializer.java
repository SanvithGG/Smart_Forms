package com.smartforms.backend.config;

import com.smartforms.backend.entity.*;
import com.smartforms.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final WorkspaceRepository workspaceRepository;
    private final FormRepository formRepository;
    private final QuestionRepository questionRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           WorkspaceRepository workspaceRepository,
                           FormRepository formRepository,
                           QuestionRepository questionRepository,
                           BranchRepository branchRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.workspaceRepository = workspaceRepository;
        this.formRepository = formRepository;
        this.questionRepository = questionRepository;
        this.branchRepository = branchRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        // 1. Create Demo User
        User user = new User();
        user.setEmail("demo@smartforms.dev");
        user.setPasswordHash(passwordEncoder.encode("password123"));
        user.setDisplayName("Demo Creator");
        user = userRepository.save(user);

        // 2. Create Default Workspace
        Workspace ws = new Workspace();
        ws.setOwnerId(user.getId());
        ws.setName("Default Workspace");
        ws = workspaceRepository.save(ws);

        // 3. Create Default Form
        Form form = new Form();
        form.setId("react-feedback-survey");
        form.setWorkspaceId(ws.getId());
        form.setTitle("React Ecosystem & Developer Pain Points");
        form.setDescription("A 3-level branching DAG survey uncovering specific frontend developer pain points and preferences.");
        form.setStatus(Form.Status.PUBLISHED);
        form.setStartNodeId("q1_react_like");
        form = formRepository.save(form);

        // 4. Create Level 1 Question
        Question q1 = createQuestion(
                "q1_react_like", form.getId(), Question.Type.MCQ,
                "Do you like React?", "Select the option that best describes your experience.",
                true, 1, 0.0, 0.0,
                """
                [
                  {"id":"opt_q1_yes","label":"Yes, absolutely"},
                  {"id":"opt_q1_neutral","label":"Somewhat / Neutral"},
                  {"id":"opt_q1_no","label":"No, not really"},
                  {"id":"opt_q1_no_idea","label":"No Idea / Haven't tried it"}
                ]
                """
        );

        // Level 2 Questions
        Question q2_yes = createQuestion(
                "q2_yes_like_most", form.getId(), Question.Type.MCQ,
                "What do you like most about React?", null,
                true, 2, 200.0, -100.0,
                """
                [
                  {"id":"opt_q2_comp_arch","label":"Easy component architecture"},
                  {"id":"opt_q2_fast_dev","label":"Fast development & Hot reload"},
                  {"id":"opt_q2_community","label":"Vibrant community & packages"},
                  {"id":"opt_q2_jsx_flex","label":"JSX flexibility & Declarative UI"}
                ]
                """
        );

        Question q2_no = createQuestion(
                "q2_no_why", form.getId(), Question.Type.MCQ,
                "Why don't you like React?", null,
                true, 2, 200.0, 0.0,
                """
                [
                  {"id":"opt_q2_complex","label":"Too complex & bloated"},
                  {"id":"opt_q2_perf","label":"Performance & re-render issues"},
                  {"id":"opt_q2_prefer_other","label":"Prefer another framework (Vue/Svelte)"},
                  {"id":"opt_q2_breaking","label":"Frequent breaking paradigm changes"}
                ]
                """
        );

        Question q2_no_idea = createQuestion(
                "q2_no_idea_why", form.getId(), Question.Type.MCQ,
                "Why haven't you tried React?", null,
                true, 2, 200.0, 100.0,
                """
                [
                  {"id":"opt_q2_no_chance","label":"Never had a chance in projects"},
                  {"id":"opt_q2_learning_other","label":"Currently learning another framework"},
                  {"id":"opt_q2_looks_diff","label":"Looks difficult with steep learning curve"},
                  {"id":"opt_q2_happy_stack","label":"Happy with current tech stack"}
                ]
                """
        );

        // Level 3 Questions
        Question q3_comp = createQuestion(
                "q3_comp_arch_why", form.getId(), Question.Type.MCQ,
                "Why is component architecture useful?", null,
                false, 3, 400.0, -150.0,
                """
                [
                  {"id":"opt_q3_reusable","label":"Code reusability across projects"},
                  {"id":"opt_q3_maint","label":"Easy maintenance & updates"},
                  {"id":"opt_q3_collab","label":"Better team collaboration"},
                  {"id":"opt_q3_modularity","label":"Isolated component testing & modularity"}
                ]
                """
        );

        Question q3_fast = createQuestion(
                "q3_fast_dev_why", form.getId(), Question.Type.MCQ,
                "What makes development faster for you?", null,
                false, 3, 400.0, -50.0,
                """
                [
                  {"id":"opt_q3_reusable_comps","label":"Pre-built component UI libraries"},
                  {"id":"opt_q3_ecosystem","label":"Massive NPM ecosystem & hooks"},
                  {"id":"opt_q3_hot_reload","label":"Instant Hot Reload & Fast Refresh"},
                  {"id":"opt_q3_devtools","label":"Rich React DevTools & debugging"}
                ]
                """
        );

        Question q3_comm = createQuestion(
                "q3_community_how", form.getId(), Question.Type.MCQ,
                "How does the community help you most?", null,
                false, 3, 400.0, 50.0,
                """
                [
                  {"id":"opt_q3_tutorials","label":"Abundant tutorials & video guides"},
                  {"id":"opt_q3_libraries","label":"High quality open-source packages"},
                  {"id":"opt_q3_issue_res","label":"Quick issue resolution on forums"},
                  {"id":"opt_q3_discussions","label":"Active Discord & Reddit communities"}
                ]
                """
        );

        // 5. Create Branches
        createBranch(form.getId(), q1.getId(), q2_yes.getId(), "{\"operator\":\"equals\",\"optionId\":\"opt_q1_yes\"}", 1);
        createBranch(form.getId(), q1.getId(), q2_yes.getId(), "{\"operator\":\"equals\",\"optionId\":\"opt_q1_neutral\"}", 2);
        createBranch(form.getId(), q1.getId(), q2_no.getId(), "{\"operator\":\"equals\",\"optionId\":\"opt_q1_no\"}", 3);
        createBranch(form.getId(), q1.getId(), q2_no_idea.getId(), "{\"operator\":\"equals\",\"optionId\":\"opt_q1_no_idea\"}", 4);

        createBranch(form.getId(), q2_yes.getId(), q3_comp.getId(), "{\"operator\":\"equals\",\"optionId\":\"opt_q2_comp_arch\"}", 1);
        createBranch(form.getId(), q2_yes.getId(), q3_fast.getId(), "{\"operator\":\"equals\",\"optionId\":\"opt_q2_fast_dev\"}", 2);
        createBranch(form.getId(), q2_yes.getId(), q3_comm.getId(), "{\"operator\":\"equals\",\"optionId\":\"opt_q2_community\"}", 3);

        System.out.println(">>> Demo data successfully seeded for SmartForms! <<<");
    }

    private Question createQuestion(String id, String formId, Question.Type type, String title, String desc,
                                   boolean req, int orderIndex, double posX, double posY, String optionsJson) {
        Question q = new Question();
        q.setId(id);
        q.setFormId(formId);
        q.setType(type);
        q.setTitle(title);
        q.setDescription(desc);
        q.setRequired(req);
        q.setOrderIndex(orderIndex);
        q.setPositionX(posX);
        q.setPositionY(posY);
        q.setOptionsJson(optionsJson.trim());
        return questionRepository.save(q);
    }

    private void createBranch(String formId, String sourceId, String targetId, String conditionJson, int priority) {
        Branch b = new Branch();
        b.setFormId(formId);
        b.setSourceQuestionId(sourceId);
        b.setTargetQuestionId(targetId);
        b.setConditionJson(conditionJson);
        b.setPriority(priority);
        branchRepository.save(b);
    }
}
