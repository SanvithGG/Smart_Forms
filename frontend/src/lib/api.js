import axiosClient from './axiosClient';
import axios from 'axios';

const ACTUATOR_HEALTH = 'http://localhost:8088/actuator/health';

/**
 * Checks if the Spring Boot backend is healthy and responding
 */
export async function checkBackendHealth() {
  try {
    const res = await axiosClient.get('/forms/react-feedback-survey/graph', { timeout: 2500 });
    if (res.status === 200) {
      return { online: true, message: 'Spring Boot Backend Live (8088)' };
    }
  } catch (e) {
    // Fallback ping check on public API route
    try {
      const res = await axios.get(ACTUATOR_HEALTH, { timeout: 2000 });
      if (res.data && (res.data.status === 'UP' || res.status === 200)) {
        return { online: true, message: 'Spring Boot Backend Live (8088)' };
      }
    } catch (err) {
      // offline
    }
  }
  return { online: false, message: 'Local Storage Mode (Backend Offline)' };
}

/**
 * Converts a backend FormWithGraphDto structure into the frontend SmartForm structure.
 */
export function convertGraphToSmartForm(graph) {
  if (!graph || !graph.form) return null;
  const form = graph.form;
  const nodesMap = {};

  // Build question nodes map
  (graph.questions || []).forEach((q) => {
    let options = [];
    if (q.optionsJson) {
      try {
        const parsed = JSON.parse(q.optionsJson);
        options = parsed.map((opt, index) => ({
          id: opt.id || `opt_${q.id}_${index + 1}`,
          questionId: q.id,
          optionText: opt.label || opt.optionText || opt.text || `Option ${index + 1}`,
          displayOrder: opt.displayOrder || index + 1,
          nextQuestionId: null,
        }));
      } catch (e) {
        console.warn('Failed to parse question options:', e);
      }
    }

    nodesMap[q.id] = {
      id: q.id,
      formId: form.id,
      questionText: q.title,
      questionType: q.type === 'MCQ' ? 'single_choice' : 'single_choice',
      level: q.orderIndex || 1,
      isStart: q.id === form.startNodeId,
      options,
    };
  });

  // Attach branching rules to options and nodes
  (graph.branches || []).forEach((b) => {
    const node = nodesMap[b.sourceQuestionId];
    if (node && b.conditionJson) {
      try {
        const cond = JSON.parse(b.conditionJson);
        if (cond.optionId) {
          const opt = node.options.find((o) => o.id === cond.optionId);
          if (opt) {
            opt.nextQuestionId = b.targetQuestionId || null;
          }
        }
      } catch (e) {
        console.warn('Failed to parse branch condition:', e);
      }
    }
  });

  return {
    id: form.id,
    title: form.title,
    description: form.description || '',
    status: (form.status || '').toLowerCase() === 'published' ? 'live' : 'draft',
    startQuestionId: form.startNodeId || Object.keys(nodesMap)[0] || 'q1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: nodesMap,
  };
}

/**
 * Fetches form graph from Spring Boot
 */
export async function fetchFormFromBackend(formId) {
  try {
    const res = await axiosClient.get(`/forms/${formId}/graph`);
    if (res.data) {
      return convertGraphToSmartForm(res.data);
    }
  } catch (e) {
    console.warn('Backend fetchForm error:', e.message);
  }
  return null;
}

/**
 * Creates a new form on the Spring Boot backend
 */
export async function createFormInBackend(title, workspaceId = 'default-ws') {
  try {
    const res = await axiosClient.post('/forms', {
      workspaceId,
      title,
      description: '',
    });
    if (res.data) {
      const formDto = res.data;
      return {
        id: formDto.id,
        title: formDto.title,
        description: formDto.description || '',
        status: 'draft',
        startQuestionId: 'q1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        nodes: {},
      };
    }
  } catch (e) {
    console.warn('Backend createForm error:', e.message);
  }
  return null;
}

/**
 * Starts a respondent submission session on Spring Boot
 */
export async function startBackendSession(formId) {
  try {
    const res = await axiosClient.post(`/public/forms/${formId}/responses`, {
      respondentRef: 'anon-user',
    });
    return res.data;
  } catch (e) {
    console.warn('Backend startSession error:', e.message);
    return null;
  }
}

/**
 * Submits an answer for a question to the backend
 */
export async function submitBackendAnswer(responseId, questionId, value) {
  try {
    const res = await axiosClient.post(`/public/forms/responses/${responseId}/answers`, {
      questionId,
      value,
    });
    return res.data;
  } catch (e) {
    console.warn('Backend submitAnswer error:', e.message);
    return null;
  }
}

/**
 * Retrieves all submitted responses for a form
 */
export async function fetchFormResponsesFromBackend(formId) {
  try {
    const res = await axiosClient.get(`/public/forms/${formId}/all-responses`);
    return res.data;
  } catch (e) {
    console.warn('Backend fetchFormResponses error:', e.message);
    return null;
  }
}
