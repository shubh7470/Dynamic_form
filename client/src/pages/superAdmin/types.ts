export interface FieldConfig {
  id: string
  name: string
  label: string
  description: string
  enabled: boolean
  position: number
  category: 'basic' | 'details' | 'status' | 'contact'
  iconName: string
  inputType: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file'
  options?: string[]
  searchable?: boolean
}

export interface CustomForm {
  id: string
  name: string
  label: string
  description: string
  fields: FieldConfig[]
}

export interface NewFieldForm {
  name: string
  label: string
  description: string
  category: 'basic' | 'details' | 'status' | 'contact'
  iconName: string
  inputType: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file'
  options: string
  searchable: boolean
}

export type FormType = 'student' | 'course' | 'branch' | string

export interface FormOption {
  key: FormType
  label: string
  icon: React.ReactNode
  description: string
}

export const categoryLabels = {
  basic: 'Basic Information',
  details: 'Details', 
  contact: 'Contact Information',
  status: 'Status Information'
} as const
