import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import { getFormsFromStorage, DEFAULT_REACT_FORM, saveFormToStorage } from '@/lib/formStore';
import { fetchFormFromBackend } from '@/lib/api';
import { LandingPage } from '@/pages/LandingPage';
import { OnboardingFlow } from '@/pages/OnboardingFlow';
import { AiFormGeneratorChat } from '@/pages/AiFormGeneratorChat';
import { TypeformAdminApp } from '@/pages/TypeformAdminApp';
import { FormAnswerView } from '@/pages/FormAnswerView';
import { WorkspaceDashboard } from '@/pages/WorkspaceDashboard';

/**
 * LandingRoute - Renders the public landing page and handles user navigation
 */
function LandingRoute() {
  const navigate = useNavigate();

  function handleStartSurvey() {
    navigate('/forms/react-feedback-survey/view');
  }

  function handleOpenEditor(generatedForm) {
    if (generatedForm) {
      saveFormToStorage(generatedForm);
      navigate('/forms/' + generatedForm.id + '/edit');
    } else {
      navigate('/workspace');
    }
  }

  return (
    <LandingPage
      onStartSurvey={handleStartSurvey}
      onOpenEditor={handleOpenEditor}
    />
  );
}

/**
 * OnboardingRoute - 3-step setup wizard for new users
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
 * AiChatRoute - Conversational AI generator for creating forms
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
 * WorkspaceRoute - Main workspace dashboard listing forms, stats, and search
 */
function WorkspaceRoute() {
  const navigate = useNavigate();

  function handleOpenForm(form) {
    navigate('/forms/' + form.id + '/edit');
  }

  function handleOpenPreview(form) {
    navigate('/forms/' + form.id + '/view');
  }

  return (
    <WorkspaceDashboard
      onOpenForm={handleOpenForm}
      onOpenPreview={handleOpenPreview}
    />
  );
}

/**
 * FormAdminRoute - The main form builder and editor view
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
 * FormAnswerRoute - The respondent questionnaire view (Locked Layout Component)
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
 * Main App Component with Client-Side Routing
 */
export function App() {
  const [onboardingProfile, setOnboardingProfile] = useState(null);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <main>
        <Routes>
          <Route path="/" element={<LandingRoute />} />
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
          <Route path="/workspace" element={<WorkspaceRoute />} />

          {/* Builder / Editor Routes */}
          <Route path="/admin" element={<FormAdminRoute />} />
          <Route path="/forms/:formId/edit" element={<FormAdminRoute />} />

          {/* MCQ Respondent View Routes (Locked layout preserved) */}
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
