import {
  REACT_DESIGN_META,
  REACT_FORM_DESIGN,
  REACT_FORM_SESSIONS,
} from "./react"
import {
  TYPESCRIPT_DESIGN_META,
  TYPESCRIPT_FORM_DESIGN,
  TYPESCRIPT_FORM_SESSIONS,
} from "./typescript"

export * from "./react"
export * from "./typescript"

export const ALL_FORM_DESIGNS = [
  {
    meta: REACT_DESIGN_META,
    form: REACT_FORM_DESIGN,
    sessions: REACT_FORM_SESSIONS,
  },
  {
    meta: TYPESCRIPT_DESIGN_META,
    form: TYPESCRIPT_FORM_DESIGN,
    sessions: TYPESCRIPT_FORM_SESSIONS,
  },
]

export function getFormDesignById(id) {
  return ALL_FORM_DESIGNS.find((d) => d.form.id === id || d.meta.id === id)
}
