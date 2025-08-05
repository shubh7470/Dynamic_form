import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/store'
import { 
  setStudentFields, 
  setCourseFields, 
  setBranchFields, 
  setLoading, 
  setError 
} from '@/reducer/superAdmin'
import { 
  getDynamicFormByTypeAPI,
  convertFieldsFromBackend
} from '@/API/services/superAdminService'
import { toast } from 'sonner'
import type { FieldConfig, CustomForm, FormType } from '@/pages/superAdmin/types'
import { defaultStudentFields, defaultCourseFields, defaultBranchFields } from '@/pages/superAdmin/constants'

export const useFormManagement = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { studentFields, courseFields, branchFields, loading, error } = useSelector(
    (state: RootState) => state.superAdmin
  )

  const [customForms, setCustomForms] = useState<CustomForm[]>([])

  // Load existing form configurations on component mount
  useEffect(() => {
    const loadFormConfigurations = async () => {
      dispatch(setLoading(true))
      try {
        const loadFormData = async (formType: string) => {
          try {
            const response = await getDynamicFormByTypeAPI(formType)
            return response.success ? response : null
          } catch (error) {
            console.log(`No saved configuration found for ${formType}`)
            return null
          }
        }

        const [studentData, courseData, branchData] = await Promise.all([
          loadFormData('student'),
          loadFormData('course'),
          loadFormData('branch')
        ])

        // If API data exists, use it; otherwise, use default local data
        if (studentData?.data) {
          dispatch(setStudentFields(convertFieldsFromBackend(studentData.data.fields)))
        } else {
          dispatch(setStudentFields(defaultStudentFields))
        }
        
        if (courseData?.data) {
          dispatch(setCourseFields(convertFieldsFromBackend(courseData.data.fields)))
        } else {
          dispatch(setCourseFields(defaultCourseFields))
        }
        
        if (branchData?.data) {
          dispatch(setBranchFields(convertFieldsFromBackend(branchData.data.fields)))
        } else {
          dispatch(setBranchFields(defaultBranchFields))
        }
      } catch (error) {
        console.error('Error loading form configurations:', error)
        // Load default data if API fails
        dispatch(setStudentFields(defaultStudentFields))
        dispatch(setCourseFields(defaultCourseFields))
        dispatch(setBranchFields(defaultBranchFields))
        dispatch(setError('Failed to load saved configurations. Using defaults.'))
      } finally {
        dispatch(setLoading(false))
      }
    }

    loadFormConfigurations()
  }, [dispatch])

  // Get current fields based on active form
  const getCurrentFields = (activeForm: FormType | string): FieldConfig[] => {
    // Check if activeForm is a custom form
    const customForm = customForms.find(form => form.id === activeForm)
    if (customForm) {
      return customForm.fields
    }

    switch (activeForm) {
      case 'student': 
        return studentFields.length > 0 ? studentFields : defaultStudentFields
      case 'course': 
        return courseFields.length > 0 ? courseFields : defaultCourseFields
      case 'branch': 
        return branchFields.length > 0 ? branchFields : defaultBranchFields
      default: 
        return studentFields.length > 0 ? studentFields : defaultStudentFields
    }
  }

  // Update fields based on active form
  const setCurrentFields = (fields: FieldConfig[], activeForm: FormType | string): void => {
    // Check if activeForm is a custom form
    const customFormIndex = customForms.findIndex(form => form.id === activeForm)
    if (customFormIndex !== -1) {
      const updatedForms = [...customForms]
      updatedForms[customFormIndex].fields = fields
      setCustomForms(updatedForms)
      return
    }

    switch (activeForm) {
      case 'student': 
        dispatch(setStudentFields(fields))
        break
      case 'course': 
        dispatch(setCourseFields(fields))
        break
      case 'branch': 
        dispatch(setBranchFields(fields))
        break
    }
  }

  // Create new custom form
  const createNewForm = (formName: string): string => {
    if (!formName.trim()) {
      toast.error('Please enter a form name')
      return ''
    }

    const formId = formName.toLowerCase().replace(/\s+/g, '-')
    const newForm: CustomForm = {
      id: formId,
      name: formId,
      label: formName,
      description: `Configure ${formName.toLowerCase()} fields`,
      fields: []
    }

    setCustomForms(prev => [...prev, newForm])
    toast.success(`Created new form: ${formName}`)
    return formId
  }

  // Add field to custom form
  const addFieldToCustomForm = (
    activeForm: string,
    fieldData: {
      name: string
      label: string
      description: string
      category: 'basic' | 'details' | 'status' | 'contact'
      iconName: string
      inputType: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file'
      options: string
      searchable: boolean
    }
  ): boolean => {
    if (!fieldData.name.trim() || !fieldData.label.trim()) {
      toast.error('Please fill in field name and label')
      return false
    }

    const currentFormIndex = customForms.findIndex(form => form.id === activeForm)
    if (currentFormIndex === -1) return false

    const fieldId = `${activeForm}_${fieldData.name}`
    const options = fieldData.inputType === 'select' && fieldData.options.trim() 
      ? fieldData.options.split(',').map(opt => opt.trim()).filter(opt => opt)
      : undefined

    const newFieldConfig: FieldConfig = {
      id: fieldId,
      name: fieldData.name,
      label: fieldData.label,
      description: fieldData.description,
      enabled: true,
      position: customForms[currentFormIndex].fields.length + 1,
      category: fieldData.category,
      iconName: fieldData.iconName,
      inputType: fieldData.inputType,
      options,
      searchable: fieldData.inputType === 'select' ? fieldData.searchable : undefined
    }

    const updatedForms = [...customForms]
    updatedForms[currentFormIndex].fields.push(newFieldConfig)
    setCustomForms(updatedForms)

    toast.success(`Added field: ${fieldData.label}`)
    return true
  }

  // Delete field from custom form
  const deleteFieldFromCustomForm = (activeForm: string, fieldId: string): void => {
    const customFormIndex = customForms.findIndex(form => form.id === activeForm)
    if (customFormIndex !== -1) {
      const updatedForms = [...customForms]
      const field = updatedForms[customFormIndex].fields.find((f: FieldConfig) => f.id === fieldId)
      updatedForms[customFormIndex].fields = updatedForms[customFormIndex].fields.filter((f: FieldConfig) => f.id !== fieldId)
      setCustomForms(updatedForms)
      if (field) {
        toast.success(`Deleted field: ${field.label}`)
      }
    }
  }

  return {
    // State
    studentFields,
    courseFields,
    branchFields,
    loading,
    error,
    customForms,
    
    // Functions
    getCurrentFields,
    setCurrentFields,
    createNewForm,
    addFieldToCustomForm,
    deleteFieldFromCustomForm
  }
}
