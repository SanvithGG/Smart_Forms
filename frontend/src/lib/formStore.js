import {
  REACT_FORM_DESIGN,
  REACT_FORM_SESSIONS,
  TYPESCRIPT_FORM_DESIGN,
  TYPESCRIPT_FORM_SESSIONS,
} from "@/designs"

const STORAGE_KEY_FORMS = "smart_forms_data_v2"
const STORAGE_KEY_SESSIONS = "smart_forms_sessions_v2"

export const DEFAULT_REACT_FORM = REACT_FORM_DESIGN
export const DEFAULT_TYPESCRIPT_FORM = TYPESCRIPT_FORM_DESIGN

export const DEFAULT_SESSIONS = [
  ...REACT_FORM_SESSIONS,
  ...TYPESCRIPT_FORM_SESSIONS,
]

export function getFormsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FORMS)
    if (!raw) {
      const initialMap = {
        [DEFAULT_REACT_FORM.id]: DEFAULT_REACT_FORM,
        [DEFAULT_TYPESCRIPT_FORM.id]: DEFAULT_TYPESCRIPT_FORM,
      }
      localStorage.setItem(STORAGE_KEY_FORMS, JSON.stringify(initialMap))
      return initialMap
    }
    const parsed = JSON.parse(raw)
    // Ensure both React and TypeScript standard designs exist
    let updated = false
    if (!parsed[DEFAULT_REACT_FORM.id]) {
      parsed[DEFAULT_REACT_FORM.id] = DEFAULT_REACT_FORM
      updated = true
    }
    if (!parsed[DEFAULT_TYPESCRIPT_FORM.id]) {
      parsed[DEFAULT_TYPESCRIPT_FORM.id] = DEFAULT_TYPESCRIPT_FORM
      updated = true
    }
    if (updated) {
      localStorage.setItem(STORAGE_KEY_FORMS, JSON.stringify(parsed))
    }
    return parsed
  } catch (e) {
    console.error("Failed to parse forms from localStorage", e)
    return {
      [DEFAULT_REACT_FORM.id]: DEFAULT_REACT_FORM,
      [DEFAULT_TYPESCRIPT_FORM.id]: DEFAULT_TYPESCRIPT_FORM,
    }
  }
}

export function saveFormToStorage(form) {
  const forms = getFormsFromStorage()
  form.updatedAt = new Date().toISOString()
  forms[form.id] = form
  localStorage.setItem(STORAGE_KEY_FORMS, JSON.stringify(forms))
}

export function getSessionsFromStorage(formId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSIONS)
    let sessions = raw ? JSON.parse(raw) : []
    if (!raw || sessions.length === 0) {
      localStorage.setItem(
        STORAGE_KEY_SESSIONS,
        JSON.stringify(DEFAULT_SESSIONS)
      )
      sessions = DEFAULT_SESSIONS
    }
    if (formId) {
      return sessions.filter((s) => s.formId === formId)
    }
    return sessions
  } catch (e) {
    console.error("Failed to parse sessions from localStorage", e)
    return DEFAULT_SESSIONS
  }
}

export function saveSessionToStorage(session) {
  const sessions = getSessionsFromStorage()
  sessions.unshift(session)
  localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions))
}

export function deleteFormFromStorage(formId) {
  const forms = getFormsFromStorage()
  delete forms[formId]
  localStorage.setItem(STORAGE_KEY_FORMS, JSON.stringify(forms))
}

export function createBlankForm(title) {
  const id = `form-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const now = new Date().toISOString()
  return {
    id,
    title: title || "Untitled form",
    description: "",
    status: "draft",
    startQuestionId: "q1",
    createdAt: now,
    updatedAt: now,
    welcomeScreen: {
      enabled: true,
      title: `Welcome to ${title || "Untitled form"}`,
      subtitle: "Please take a moment to share your feedback.",
      buttonText: "Start",
      timeToComplete: "Takes 2 minutes",
    },
    nodes: {
      q1: {
        id: "q1",
        formId: id,
        questionText: "Your first question",
        questionType: "single_choice",
        level: 1,
        isStart: true,
        options: [
          {
            id: `opt_${id}_a`,
            optionText: "Option A",
            displayOrder: 1,
            nextQuestionId: null,
          },
          {
            id: `opt_${id}_b`,
            optionText: "Option B",
            displayOrder: 2,
            nextQuestionId: null,
          },
          {
            id: `opt_${id}_c`,
            optionText: "Option C",
            displayOrder: 3,
            nextQuestionId: null,
          },
          {
            id: `opt_${id}_d`,
            optionText: "Option D",
            displayOrder: 4,
            nextQuestionId: null,
          },
        ],
      },
    },
  }
}

export function updateQuestionLogic(formId, questionId, logicConfig) {
  const forms = getFormsFromStorage()
  const form = forms[formId]
  if (!form || !form.nodes[questionId]) return form || DEFAULT_REACT_FORM

  const node = form.nodes[questionId]

  if (logicConfig.branchingRules) {
    node.options = node.options.map((opt) => ({
      ...opt,
      nextQuestionId:
        logicConfig.branchingRules &&
        logicConfig.branchingRules[opt.id] !== undefined
          ? logicConfig.branchingRules[opt.id]
          : opt.nextQuestionId,
    }))
  }

  node.logic = {
    ...node.logic,
    ...logicConfig,
  }

  form.updatedAt = new Date().toISOString()
  saveFormToStorage(form)
  return form
}

export function clearAllFormLogic(formId) {
  const forms = getFormsFromStorage()
  const form = forms[formId]
  if (!form) return DEFAULT_REACT_FORM

  Object.values(form.nodes).forEach((node) => {
    delete node.logic
    node.options = node.options.map((opt) => ({ ...opt, nextQuestionId: null }))
  })

  form.updatedAt = new Date().toISOString()
  saveFormToStorage(form)
  return form
}
