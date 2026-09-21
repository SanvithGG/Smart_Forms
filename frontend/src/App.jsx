import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import { getFormsFromStorage, DEFAULT_REACT_FORM, saveFormToStorage } from '@/lib/formStore';
import { fetchFormFromBackend } from '@/lib/api';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { OnboardingFlow } from '@/pages/OnboardingFlow';
import { AiFormGeneratorChat } from '@/pages/AiFormGeneratorChat';
import { TypeformAdminApp } from '@/pages/TypeformAdminApp';
import { FormAnswerView } from '@/pages/FormAnswerView';
import { WorkspaceDashboard } from '@/pages/WorkspaceDashboard';

/**
 * 1. LandingRoute - Renders the public landing page.
 * Buttons lead to login (/login) or test live survey.
 */
function LandingRoute() {
  const navigate = useNavigate();

  function handleLogin() {
    navigate('/login');
  }

  function handleStartSurvey() {
    navigate('/forms/react-feedback-survey/view');
  }

  function handleOpenEditor(generatedForm) {
    if (generatedForm) {
      saveFormToStorage(generatedForm);
      navigate('/forms/' + generatedForm.id + '/edit');
    } else {
      navigate('/login');
    }
  }

  return (
    <LandingPage
      onLogin={handleLogin}
      onStartSurvey={handleStartSurvey}
      onOpenEditor={handleOpenEditor}
    />
  );
}

/**
 * 2. LoginRoute - Authentication page for Sign In, Sign Up, & 1-Click Demo.
 * Redirects to the Workspace Dashboard (/workspace) on success.
 */
function LoginRoute() {
  const navigate = useNavigate();

  function handleLoginSuccess() {
    navigate('/workspace');
  }

  function handleBackToLanding() {
    navigate('/');
  }

  return (
    <LoginPage
      onLoginSuccess={handleLoginSuccess}
      onBackToLanding={handleBackToLanding}
    />
  );
}

/**
 * 3. WorkspaceRoute - Main workspace dashboard listing forms, stats, and search.
 * Shows user profile and logout action.
 */
function WorkspaceRoute() {
  const navigate = useNavigate();

  function handleOpenForm(form) {
    navigate('/forms/' + form.id + '/edit');
  }

  function handleOpenPreview(form) {
    navigate('/forms/' + form.id + '/view');
  }

  function handleLogout() {
    navigate('/login');
  }

  return (
    <WorkspaceDashboard
      onOpenForm={handleOpenForm}
      onOpenPreview={handleOpenPreview}
      onLogout={handleLogout}
    />
  );
}

/**
 * 4. OnboardingRoute - 3-step setup wizard for new users
 */
function OnboardingRoute({ onComplete }) {
  const navigate = useNavigate();

  function handleCompleteOnboarding(profile) {
    onComplete(profile);
    navigate('/ai-chat');
  }

  return <OnboardingFlow onCompleteOnboarding={handleCompleteOnboarding} />;
}

/**
 * 5. AiChatRoute - Conversational AI generator for creating forms
 */
function AiChatRoute({ profile }) {
  const navigate = useNavigate();

  function handleLaunchBuilder(generatedForm) {
    saveFormToStorage(generatedForm);
    navigate('/forms/' + generatedForm.id + '/edit');
  }

  return (
    <AiFormGeneratorChat
      profile={profile}
      onLaunchBuilder={handleLaunchBuilder}
    />
  );
}

/**
 * 6. FormAdminRoute - The main form builder and editor view
 */
function FormAdminRoute() {
  const navigate = useNavigate();
  const { formId } = useParams();

  const [form, setForm] = useState(function () {
    const loadedForms = getFormsFromStorage();
    if (formId && loadedForms[formId]) {
      return loadedForms[formId];
    }
    return DEFAULT_REACT_FORM;
  });

  useEffect(
    function () {
      const loadedForms = getFormsFromStorage();
      if (formId && loadedForms[formId]) {
        setForm(loadedForms[formId]);
      } else if (formId) {
        // Attempt to load from Spring Boot backend if not found locally
        fetchFormFromBackend(formId).then(function (backendForm) {
          if (backendForm) {
            saveFormToStorage(backendForm);
            setForm(backendForm);
          }
        });
      }
    },
    [formId]
  );

  function handleOpenPreview(formToPreview) {
    const targetId = formToPreview?.id || form.id;
    navigate('/forms/' + targetId + '/view');
  }

  function handleOpenAiChat() {
    navigate('/ai-chat');
  }

  function handleBackToWorkspace() {
    navigate('/workspace');
  }

  return (
    <TypeformAdminApp
      key={form.id}
      initialForm={form}
      onOpenPreview={handleOpenPreview}
      onOpenAiChat={handleOpenAiChat}
      onBackToWorkspace={handleBackToWorkspace}
    />
  );
}

/**
 * 7. FormAnswerRoute - The respondent questionnaire view (Locked Layout Component)
 */
function FormAnswerRoute() {
  const navigate = useNavigate();
  const { formId } = useParams();

  const [form, setForm] = useState(function () {
    const loadedForms = getFormsFromStorage();
    if (formId && loadedForms[formId]) {
      return loadedForms[formId];
    }
    return DEFAULT_REACT_FORM;
  });

  useEffect(
    function () {
      const loadedForms = getFormsFromStorage();
      if (formId && loadedForms[formId]) {
        setForm(loadedForms[formId]);
      } else if (formId) {
        fetchFormFromBackend(formId).then(function (backendForm) {
          if (backendForm) {
            saveFormToStorage(backendForm);
            setForm(backendForm);
          }
        });
      }
    },
    [formId]
  );

  function handleOpenEditor() {
    navigate('/forms/' + form.id + '/edit');
  }

  function handleReturnHome() {
    navigate('/workspace');
  }

  return (
    <FormAnswerView
      form={form}
      onOpenEditor={handleOpenEditor}
      onReturnHome={handleReturnHome}
    />
  );
}

/**
 * Main App Component with Client-Side Routing:
 * Flow: Landing Page (/) -> Login (/login) -> Workspace (/workspace) -> Builder (/forms/:id/edit)
 */
export function App() {
  const [onboardingProfile, setOnboardingProfile] = useState(null);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <main>
        <Routes>
          {/* 1. Public Landing Page */}
          <Route path="/" element={<LandingRoute />} />

          {/* 2. Authentication Flow */}
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/auth" element={<Navigate to="/login" replace />} />

          {/* 3. Workspace Dashboard (User's Forms & Overview) */}
          <Route path="/workspace" element={<WorkspaceRoute />} />

          {/* 4. Onboarding & AI Generator Flow */}
          <Route
            path="/onboarding"
            element={<OnboardingRoute onComplete={setOnboardingProfile} />}
          />
          <Route
            path="/ai-chat"
            element={<AiChatRoute profile={onboardingProfile} />}
          />
          <Route
            path="/ai-generator"
            element={<AiChatRoute profile={onboardingProfile} />}
          />

          {/* 5. Builder / Editor Routes */}
          <Route path="/admin" element={<FormAdminRoute />} />
          <Route path="/forms/:formId/edit" element={<FormAdminRoute />} />

          {/* 6. MCQ Respondent View Routes (Locked layout preserved) */}
          <Route path="/answer" element={<FormAnswerRoute />} />
          <Route path="/forms/:formId/view" element={<FormAnswerRoute />} />
          <Route path="/forms/:formId/answer" element={<FormAnswerRoute />} />

          {/* Catch-all redirect to Landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
