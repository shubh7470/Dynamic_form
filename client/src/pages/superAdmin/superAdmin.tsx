import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store"
import { 
  setStudentFields, 
  setCourseFields, 
  setBranchFields, 
  setLoading, 
  setError 
} from "@/reducer/superAdmin"
import { 
  createDynamicFormAPI, 
  getDynamicFormByTypeAPI,
  updateDynamicFormAPI,
  convertFieldsFromBackend,
  type DynamicFormData 
} from "@/API/services/superAdminService"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Save, RotateCcw, User, GraduationCap, MapPin, Calendar, UserCheck, Building, BookOpen, Plus, Edit3 } from "lucide-react"

// Import extracted components
import { 
  Sidebar, 
  FormHeader, 
  FormOrderPreview, 
  FieldConfigCard, 
  AddFieldForm 
} from './components'

// Import types
import type { FieldConfig, CustomForm, NewFieldForm, FormType } from './types'
import { categoryLabels } from './types'

// Icon mapping function
const getIcon = (iconName: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    'User': <User className="h-4 w-4" />,
    'GraduationCap': <GraduationCap className="h-4 w-4" />,
    'MapPin': <MapPin className="h-4 w-4" />,
    'Calendar': <Calendar className="h-4 w-4" />,
    'UserCheck': <UserCheck className="h-4 w-4" />,
    'Building': <Building className="h-4 w-4" />,
    'BookOpen': <BookOpen className="h-4 w-4" />,
  }
  return iconMap[iconName] || <User className="h-4 w-4" />
}

// Custom hook for media query
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addListener(listener)
    return () => media.removeListener(listener)
  }, [matches, query])

  return matches
}

const SuperAdminPanel: React.FC = () => {
  console.log('🏁 SuperAdminPanel component initialized!')
  
  const dispatch = useDispatch<AppDispatch>()
  const { studentFields, courseFields, branchFields, loading, error } = useSelector(
    (state: RootState) => state.superAdmin
  )
  
  console.log('📊 Redux state:', { studentFields: studentFields.length, courseFields: courseFields.length, branchFields: branchFields.length, loading, error })
  
  const [activeForm, setActiveForm] = useState<FormType>('student')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Dynamic form creation states
  const [showAddForm, setShowAddForm] = useState(false)
  const [newFormName, setNewFormName] = useState('')
  const [customForms, setCustomForms] = useState<CustomForm[]>(() => {
    // Load custom forms from localStorage on initialization
    const savedForms = localStorage.getItem('customForms')
    return savedForms ? JSON.parse(savedForms) : []
  })
  const [isCreatingCustomForm, setIsCreatingCustomForm] = useState(false)
  const [showAddField, setShowAddField] = useState(false)
  const [newField, setNewField] = useState<NewFieldForm>({
    name: '',
    label: '',
    description: '',
    category: 'basic',
    iconName: 'User',
    inputType: 'text',
    options: '',
    searchable: false
  })

  // Use media query for responsive design
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  // Save custom forms to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('customForms', JSON.stringify(customForms))
  }, [customForms])

  // Load existing form configurations on component mount
  useEffect(() => {
    console.log('🔥 useEffect triggered - loadFormConfigurations starting...')
    console.log('🌐 Environment check:', {
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
      NODE_ENV: import.meta.env.NODE_ENV,
      MODE: import.meta.env.MODE
    })
    
    const loadFormConfigurations = async () => {
      console.log('📡 Starting loadFormConfigurations function...')
      dispatch(setLoading(true))
      try {
        const loadFormData = async (formType: string) => {
          try {
            console.log(`🔄 Making API request for formType: ${formType}`)
            console.log(`🌐 API URL: ${import.meta.env.VITE_API_BASE_URL}/dynamic-forms/type/${formType}`)
            const response = await getDynamicFormByTypeAPI(formType)
            console.log(`✅ API Response for ${formType}:`, response)
            return response.success ? response : null
          } catch (error) {
            console.error(`❌ API Error for ${formType}:`, error)
            return null
          }
        }

        console.log('🚀 About to call Promise.all with API requests...')
        const [studentData, courseData, branchData] = await Promise.all([
          loadFormData('student'),
          loadFormData('course'),
          loadFormData('branch')
        ])
        console.log('📋 Promise.all completed:', { studentData, courseData, branchData })

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

        // Load any custom forms that might exist in backend
        console.log('📋 Loading custom forms...')
        const savedCustomForms = localStorage.getItem('customForms')
        if (savedCustomForms) {
          const customFormsFromStorage = JSON.parse(savedCustomForms)
          // Try to load each custom form from backend
          for (const customForm of customFormsFromStorage) {
            try {
              const customFormData = await loadFormData(customForm.id)
              if (customFormData?.data) {
                // Update the custom form with backend data
                customForm.fields = convertFieldsFromBackend(customFormData.data.fields)
                console.log(`✅ Loaded custom form ${customForm.id} from backend`)
              }
            } catch (error) {
              console.log(`ℹ️ Custom form ${customForm.id} not found in backend, using local data`)
            }
          }
          setCustomForms(customFormsFromStorage)
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
        console.log('🏁 loadFormConfigurations completed!')
      }
    }

    console.log('⚡ About to call loadFormConfigurations...')
    loadFormConfigurations()
      .then(() => console.log('✅ loadFormConfigurations resolved successfully'))
      .catch(err => console.error('❌ loadFormConfigurations rejected:', err))
  }, [dispatch])

  // Convert frontend data to backend format
  const convertFrontendToBackend = (fields: FieldConfig[], formType: FormType | string): DynamicFormData => {
    const fieldsArray = fields.map(field => ({
      name: field.name,
      label: field.label,
      placeholder: field.description,
      type: field.inputType as 'text' | 'number' | 'email' | 'date' | 'tel' | 'file' | 'select' | 'textarea' | 'checkbox' | 'radio',
      isActive: field.enabled,
      order: field.position,
      options: field.options ? field.options.map(opt => ({ value: opt })) : [],
      isSearchable: field.searchable || false
    }))

    return {
      formType: formType as any, // Allow custom form types
      fields: fieldsArray
    }
  }

  // Default field configurations (rename existing arrays)
  const defaultStudentFields: FieldConfig[] = [
    // Basic Information
    {
      id: 'studentName',
      name: 'studentName',
      label: 'Add Student',
      description: 'Student\'s complete name',
      enabled: true,
      position: 1,
      category: 'basic',
      iconName: 'User',
      inputType: 'text'
    },
    {
      id: 'selectedCourse',
      name: 'selectedCourse',
      label: 'Select Course',
      description: 'Course selection dropdown',
      enabled: true,
      position: 2,
      category: 'details',
      iconName: 'GraduationCap',
      inputType: 'select',
      options: [
        'Computer Basic',
        'DCA (Diploma in Computer Applications)',
        'ADCA (Advanced Diploma in Computer Applications)',
        'DTP (Desktop Publishing)',
        'Tally ERP 9',
        'Web Designing',
        'Java Programming',
        'Python Programming',
        'Data Entry Operator',
        'Digital Marketing',
        'Graphic Designing',
        'Computer Hardware & Networking'
      ],
      searchable: true
    },
    {
      id: 'state',
      name: 'state',
      label: 'Select State',
      description: 'Student\'s state',
      enabled: true,
      position: 3,
      category: 'contact',
      iconName: 'MapPin',
      inputType: 'select',
      options: [
        'Andhra Pradesh',
        'Arunachal Pradesh',
        'Assam',
        'Bihar',
        'Chhattisgarh',
        'Goa',
        'Gujarat',
        'Haryana',
        'Himachal Pradesh',
        'Jharkhand',
        'Karnataka',
        'Kerala',
        'Madhya Pradesh',
        'Maharashtra',
        'Manipur',
        'Meghalaya',
        'Mizoram',
        'Nagaland',
        'Odisha',
        'Punjab',
        'Rajasthan',
        'Sikkim',
        'Tamil Nadu',
        'Telangana',
        'Tripura',
        'Uttar Pradesh',
        'Uttarakhand',
        'West Bengal',
        'Delhi',
        'Jammu and Kashmir',
        'Ladakh',
        'Chandigarh',
        'Dadra and Nagar Haveli and Daman and Diu',
        'Lakshadweep',
        'Puducherry',
        'Andaman and Nicobar Islands'
      ],
      searchable: true
    },
    {
      id: 'courseName',
      name: 'courseName',
      label: 'Course Name',
      description: 'Name of the selected course',
      enabled: true,
      position: 4,
      category: 'details',
      iconName: 'BookOpen',
      inputType: 'text'
    },
    {
      id: 'studentEmail',
      name: 'studentEmail',
      label: 'Student Email',
      description: 'Student\'s email address',
      enabled: true,
      position: 5,
      category: 'contact',
      iconName: 'User',
      inputType: 'email'
    },
    {
      id: 'phoneNumber',
      name: 'phoneNumber',
      label: 'Phone Number',
      description: 'Student\'s contact number',
      enabled: true,
      position: 6,
      category: 'contact',
      iconName: 'User',
      inputType: 'tel'
    },
    {
      id: 'aadhaarNumber',
      name: 'aadhaarNumber',
      label: 'Adhaar Number',
      description: 'Government issued Aadhaar ID number',
      enabled: true,
      position: 7,
      category: 'basic',
      iconName: 'User',
      inputType: 'text'
    },
    {
      id: 'registrationNumber',
      name: 'registrationNumber',
      label: 'Registration Number',
      description: 'Unique student registration ID',
      enabled: true,
      position: 8,
      category: 'details',
      iconName: 'GraduationCap',
      inputType: 'text'
    },
    {
      id: 'city',
      name: 'city',
      label: 'City',
      description: 'Student\'s city',
      enabled: true,
      position: 9,
      category: 'contact',
      iconName: 'MapPin',
      inputType: 'text'
    },
    {
      id: 'dateOfBirth',
      name: 'dateOfBirth',
      label: 'Select Date of Birth',
      description: 'Student\'s birth date',
      enabled: true,
      position: 10,
      category: 'basic',
      iconName: 'Calendar',
      inputType: 'date'
    },
    {
      id: 'registrationYear',
      name: 'registrationYear',
      label: 'Select Registration Year',
      description: 'Year of registration',
      enabled: true,
      position: 11,
      category: 'details',
      iconName: 'Calendar',
      inputType: 'select',
      options: [
        '2020',
        '2021',
        '2022',
        '2023',
        '2024',
        '2025',
        '2026',
        '2027',
        '2028',
        '2029',
        '2030'
      ],
      searchable: false
    },
    {
      id: 'admissionDate',
      name: 'admissionDate',
      label: 'Select Admission Date',
      description: 'Date of admission',
      enabled: true,
      position: 12,
      category: 'details',
      iconName: 'Calendar',
      inputType: 'date'
    },
    {
      id: 'maritalStatus',
      name: 'maritalStatus',
      label: 'Select Marital Status',
      description: 'Student\'s marital status',
      enabled: true,
      position: 13,
      category: 'basic',
      iconName: 'User',
      inputType: 'select',
      options: [
        'Single',
        'Married',
        'Divorced',
        'Widowed',
        'Separated'
      ],
      searchable: false
    },
    {
      id: 'address',
      name: 'address',
      label: 'Address',
      description: 'Complete address',
      enabled: true,
      position: 14,
      category: 'contact',
      iconName: 'MapPin',
      inputType: 'textarea'
    },
    {
      id: 'pinCode',
      name: 'pinCode',
      label: 'Pin Code',
      description: 'Postal pin code',
      enabled: true,
      position: 15,
      category: 'contact',
      iconName: 'MapPin',
      inputType: 'text'
    },
    {
      id: 'isActive',
      name: 'isActive',
      label: 'Active Student',
      description: 'Student active status',
      enabled: true,
      position: 16,
      category: 'status',
      iconName: 'UserCheck',
      inputType: 'checkbox'
    },
    {
      id: 'isRegistered',
      name: 'isRegistered',
      label: 'Registered Student',
      description: 'Student registration status',
      enabled: true,
      position: 17,
      category: 'status',
      iconName: 'UserCheck',
      inputType: 'checkbox'
    },
    {
      id: 'completedCourse',
      name: 'completedCourse',
      label: 'Completed Course',
      description: 'Course completion status',
      enabled: true,
      position: 18,
      category: 'status',
      iconName: 'GraduationCap',
      inputType: 'checkbox'
    },
    {
      id: 'studentPhoto',
      name: 'studentPhoto',
      label: 'Student Photo',
      description: 'Upload student photo (JPG, PNG, SVG or GIF - Max 1MB)',
      enabled: true,
      position: 19,
      category: 'basic',
      iconName: 'User',
      inputType: 'file'
    },
    {
      id: 'documents',
      name: 'documents',
      label: 'Documents',
      description: 'Upload student documents (JPG, PNG, SVG or GIF - Max 1MB)',
      enabled: true,
      position: 20,
      category: 'basic',
      iconName: 'User',
      inputType: 'file'
    },
    {
      id: 'signature',
      name: 'signature',
      label: 'Signature',
      description: 'Upload student signature (JPG, PNG, SVG or GIF - Max 1MB)',
      enabled: true,
      position: 21,
      category: 'basic',
      iconName: 'User',
      inputType: 'file'
    }
  ]

  const defaultCourseFields: FieldConfig[] = [
    {
      id: 'courseName',
      name: 'courseName',
      label: 'Course Name',
      description: 'Name of the course',
      enabled: true,
      position: 1,
      category: 'basic',
      iconName: 'BookOpen',
      inputType: 'text'
    },
    {
      id: 'courseCode',
      name: 'courseCode',
      label: 'Course Code',
      description: 'Unique course identifier',
      enabled: true,
      position: 2,
      category: 'basic',
      iconName: 'BookOpen',
      inputType: 'text'
    },
    {
      id: 'courseDescription',
      name: 'description',
      label: 'Course Description',
      description: 'Detailed course information',
      enabled: true,
      position: 3,
      category: 'details',
      iconName: 'BookOpen',
      inputType: 'textarea'
    },
    {
      id: 'duration',
      name: 'duration',
      label: 'Course Duration',
      description: 'Duration in months',
      enabled: true,
      position: 4,
      category: 'details',
      iconName: 'Calendar',
      inputType: 'number'
    },
    {
      id: 'fees',
      name: 'fees',
      label: 'Course Fees',
      description: 'Total course fees',
      enabled: true,
      position: 5,
      category: 'details',
      iconName: 'BookOpen',
      inputType: 'number'
    },
    {
      id: 'category',
      name: 'category',
      label: 'Course Category',
      description: 'Category of the course',
      enabled: true,
      position: 6,
      category: 'basic',
      iconName: 'BookOpen',
      inputType: 'select',
      options: [
        'Computer Fundamentals',
        'Programming',
        'Web Development',
        'Data Science',
        'Digital Marketing',
        'Accounting Software',
        'Design & Multimedia',
        'Hardware & Networking',
        'Office Applications',
        'Certification Courses'
      ],
      searchable: true
    },
    {
      id: 'isActive',
      name: 'isActive',
      label: 'Active Course',
      description: 'Course active status',
      enabled: true,
      position: 7,
      category: 'status',
      iconName: 'UserCheck',
      inputType: 'checkbox'
    }
  ]

  const defaultBranchFields: FieldConfig[] = [
    {
      id: 'addBranch',
      name: 'addBranch',
      label: 'Add Branch',
      description: 'Branch name or title',
      enabled: true,
      position: 1,
      category: 'basic',
      iconName: 'Building',
      inputType: 'text'
    },
    {
      id: 'userName',
      name: 'userName',
      label: 'User Name',
      description: 'Branch admin username',
      enabled: true,
      position: 2,
      category: 'basic',
      iconName: 'User',
      inputType: 'text'
    },
    {
      id: 'password',
      name: 'password',
      label: 'Password',
      description: 'Branch admin password',
      enabled: true,
      position: 3,
      category: 'basic',
      iconName: 'User',
      inputType: 'text'
    },
    {
      id: 'courseName',
      name: 'courseName',
      label: 'Course Name',
      description: 'Available course at this branch',
      enabled: true,
      position: 4,
      category: 'details',
      iconName: 'GraduationCap',
      inputType: 'text'
    },
    {
      id: 'branchCode',
      name: 'branchCode',
      label: 'Branch Code',
      description: 'Unique branch identifier',
      enabled: true,
      position: 5,
      category: 'basic',
      iconName: 'Building',
      inputType: 'text'
    },
    {
      id: 'email',
      name: 'email',
      label: 'Email',
      description: 'Branch email address',
      enabled: true,
      position: 6,
      category: 'contact',
      iconName: 'User',
      inputType: 'email'
    },
    {
      id: 'phoneNumber',
      name: 'phoneNumber',
      label: 'Phone Number',
      description: 'Branch contact number',
      enabled: true,
      position: 7,
      category: 'contact',
      iconName: 'User',
      inputType: 'tel'
    },
    {
      id: 'directorName',
      name: 'directorName',
      label: 'Director Name',
      description: 'Branch director\'s name',
      enabled: true,
      position: 8,
      category: 'details',
      iconName: 'User',
      inputType: 'text'
    },
    {
      id: 'state',
      name: 'state',
      label: 'Select State',
      description: 'Branch state',
      enabled: true,
      position: 9,
      category: 'contact',
      iconName: 'MapPin',
      inputType: 'select',
      options: [
        'Andhra Pradesh',
        'Arunachal Pradesh',
        'Assam',
        'Bihar',
        'Chhattisgarh',
        'Goa',
        'Gujarat',
        'Haryana',
        'Himachal Pradesh',
        'Jharkhand',
        'Karnataka',
        'Kerala',
        'Madhya Pradesh',
        'Maharashtra',
        'Manipur',
        'Meghalaya',
        'Mizoram',
        'Nagaland',
        'Odisha',
        'Punjab',
        'Rajasthan',
        'Sikkim',
        'Tamil Nadu',
        'Telangana',
        'Tripura',
        'Uttar Pradesh',
        'Uttarakhand',
        'West Bengal',
        'Delhi',
        'Jammu and Kashmir',
        'Ladakh',
        'Chandigarh',
        'Dadra and Nagar Haveli and Daman and Diu',
        'Lakshadweep',
        'Puducherry',
        'Andaman and Nicobar Islands'
      ],
      searchable: true
    },
    {
      id: 'district',
      name: 'district',
      label: 'District',
      description: 'Branch district',
      enabled: true,
      position: 10,
      category: 'contact',
      iconName: 'MapPin',
      inputType: 'text'
    },
    {
      id: 'location',
      name: 'location',
      label: 'Location',
      description: 'Branch location details',
      enabled: true,
      position: 11,
      category: 'contact',
      iconName: 'MapPin',
      inputType: 'text'
    },
    {
      id: 'branchAddress',
      name: 'branchAddress',
      label: 'Branch Address',
      description: 'Complete branch address',
      enabled: true,
      position: 12,
      category: 'contact',
      iconName: 'MapPin',
      inputType: 'textarea'
    },
    {
      id: 'directorAddress',
      name: 'directorAddress',
      label: 'Director Address',
      description: 'Director\'s residential address',
      enabled: true,
      position: 13,
      category: 'contact',
      iconName: 'MapPin',
      inputType: 'textarea'
    },
    {
      id: 'religion',
      name: 'religion',
      label: 'Religion',
      description: 'Religious affiliation if applicable',
      enabled: true,
      position: 14,
      category: 'details',
      iconName: 'User',
      inputType: 'text'
    },
    {
      id: 'branchDocument1',
      name: 'branchDocument1',
      label: 'Branch Document 1',
      description: 'Upload branch document (JPG, PNG, SVG or GIF - Max 1MB)',
      enabled: true,
      position: 15,
      category: 'basic',
      iconName: 'Building',
      inputType: 'file'
    },
    {
      id: 'branchDocument2',
      name: 'branchDocument2',
      label: 'Branch Document 2',
      description: 'Upload additional branch document (JPG, PNG, SVG or GIF - Max 1MB)',
      enabled: true,
      position: 16,
      category: 'basic',
      iconName: 'Building',
      inputType: 'file'
    },
    {
      id: 'fees1',
      name: 'fees1',
      label: 'Enter Fees 1',
      description: 'First fee structure',
      enabled: true,
      position: 17,
      category: 'details',
      iconName: 'BookOpen',
      inputType: 'number'
    },
    {
      id: 'fees2',
      name: 'fees2',
      label: 'Enter Fees 2',
      description: 'Second fee structure',
      enabled: true,
      position: 18,
      category: 'details',
      iconName: 'BookOpen',
      inputType: 'number'
    },
    {
      id: 'fees3',
      name: 'fees3',
      label: 'Enter Fees 3',
      description: 'Third fee structure',
      enabled: true,
      position: 19,
      category: 'details',
      iconName: 'BookOpen',
      inputType: 'number'
    },
    {
      id: 'fees4',
      name: 'fees4',
      label: 'Enter Fees 4',
      description: 'Fourth fee structure',
      enabled: true,
      position: 20,
      category: 'details',
      iconName: 'BookOpen',
      inputType: 'number'
    },
    {
      id: 'fees5',
      name: 'fees5',
      label: 'Enter Fees 5',
      description: 'Fifth fee structure',
      enabled: true,
      position: 21,
      category: 'details',
      iconName: 'BookOpen',
      inputType: 'number'
    },
    {
      id: 'isActive',
      name: 'isActive',
      label: 'Active Branch',
      description: 'Branch active status',
      enabled: true,
      position: 22,
      category: 'status',
      iconName: 'UserCheck',
      inputType: 'checkbox'
    }
  ]

  // Use Redux fields or fallback to default
  const getCurrentFields = () => {
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

  // Update Redux fields
  const setCurrentFields = (fields: FieldConfig[]) => {
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

  const handleDragStart = (e: React.DragEvent, fieldId: string) => {
    e.dataTransfer.setData('text/plain', fieldId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetFieldId: string) => {
    e.preventDefault()
    const draggedFieldId = e.dataTransfer.getData('text/plain')
    
    if (draggedFieldId === targetFieldId) return

    const currentFields = [...getCurrentFields()].sort((a, b) => a.position - b.position)
    const draggedIndex = currentFields.findIndex(field => field.id === draggedFieldId)
    const targetIndex = currentFields.findIndex(field => field.id === targetFieldId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newFields = [...currentFields]
    const [draggedField] = newFields.splice(draggedIndex, 1)
    newFields.splice(targetIndex, 0, draggedField)

    // Reassign positions based on new order
    const updatedFields = newFields.map((field, index) => ({
      ...field,
      position: index + 1
    }))

    setCurrentFields(updatedFields)
    toast.success(`Moved "${draggedField.label}" to new position`)
  }

  const toggleField = (fieldId: string) => {
    const currentFields = getCurrentFields()
    const updatedFields = currentFields.map(field => 
      field.id === fieldId 
        ? { ...field, enabled: !field.enabled }
        : field
    )
    setCurrentFields(updatedFields)
  }

  const saveConfiguration = async () => {
    console.log('💾 Starting saveConfiguration process...')
    console.log('🌐 API Base URL:', import.meta.env.VITE_API_BASE_URL)
    dispatch(setLoading(true))
    
    try {
      const currentFields = getCurrentFields()
      const enabledFields = currentFields.filter(field => field.enabled)
      
      console.log('📋 Current fields:', currentFields.length)
      console.log('✅ Enabled fields:', enabledFields.length)
      console.log('📝 Active form type:', activeForm)
      
      // Convert frontend data to backend format
      const formData = convertFrontendToBackend(currentFields, activeForm)
      console.log('🔄 Converted form data:', JSON.stringify(formData, null, 2))
      
      // First, try to check if configuration already exists
      console.log('🔍 Checking if configuration already exists...')
      let existingConfig = null
      try {
        console.log(`🌐 Making GET request to: ${import.meta.env.VITE_API_BASE_URL}/dynamic-forms/type/${activeForm}`)
        const existingResponse = await getDynamicFormByTypeAPI(activeForm)
        if (existingResponse.success && existingResponse.data) {
          existingConfig = existingResponse.data
          console.log('📋 Found existing configuration:', existingConfig)
        }
      } catch (error) {
        console.log('ℹ️ No existing configuration found, will create new one')
        console.error('🔍 Error checking existing config:', error)
      }
      
      let response
      if (existingConfig && existingConfig._id) {
        // UPDATE existing configuration
        console.log('🔄 Updating existing configuration with ID:', existingConfig._id)
        console.log(`🌐 Making PUT request to: ${import.meta.env.VITE_API_BASE_URL}/dynamic-forms/${existingConfig._id}`)
        response = await updateDynamicFormAPI(existingConfig._id, formData)
        console.log('✅ Update response:', response)
      } else {
        // CREATE new configuration
        console.log('➕ Creating new configuration...')
        console.log(`🌐 Making POST request to: ${import.meta.env.VITE_API_BASE_URL}/dynamic-forms`)
        response = await createDynamicFormAPI(formData)
        console.log('✅ Create response:', response)
      }
      
      if (response.success) {
        const action = existingConfig ? 'updated' : 'created'
        toast.success(`${activeForm.charAt(0).toUpperCase() + activeForm.slice(1)} form configuration ${action} successfully! ${enabledFields.length} fields enabled.`)
        console.log(`✅ Successfully ${action} ${activeForm} configuration`)
      } else {
        throw new Error(response.message || 'Failed to save configuration')
      }
    } catch (error: any) {
      console.error('❌ Error saving configuration:', error)
      toast.error(error.message || 'Failed to save configuration. Please try again.')
      dispatch(setError('Failed to save configuration'))
    } finally {
      dispatch(setLoading(false))
      console.log('🏁 saveConfiguration process completed')
    }
  }

  const resetToDefault = () => {
    const currentFields = getCurrentFields()
    const defaultEnabledFields = ['name', 'email', 'contactNumber', 'address', 'isActive']
    const updatedFields = currentFields.map((field, index) => ({
      ...field,
      enabled: defaultEnabledFields.includes(field.name) || field.name.includes('Name') || field.name.includes('Code'),
      position: index + 1 // Reset positions to original order
    }))
    setCurrentFields(updatedFields)
    toast.info(`${activeForm.charAt(0).toUpperCase() + activeForm.slice(1)} form configuration reset to default settings.`)
  }

  // Custom form creation functions
  const createNewForm = () => {
    if (!newFormName.trim()) {
      toast.error('Please enter a form name')
      return
    }

    const formId = newFormName.toLowerCase().replace(/\s+/g, '-')
    const newForm: CustomForm = {
      id: formId,
      name: formId,
      label: newFormName,
      description: `Configure ${newFormName.toLowerCase()} fields`,
      fields: []
    }

    setCustomForms(prev => [...prev, newForm])
    setActiveForm(formId as FormType)
    setIsCreatingCustomForm(true)
    setNewFormName('')
    setShowAddForm(false)
    toast.success(`Created new form: ${newFormName}`)
  }

  const addFieldToForm = () => {
    if (!newField.name.trim() || !newField.label.trim()) {
      toast.error('Please fill in field name and label')
      return
    }

    const currentFields = getCurrentFields()
    const fieldId = `${activeForm}_${newField.name}_${Date.now()}`
    const options = newField.inputType === 'select' && newField.options.trim() 
      ? newField.options.split(',').map(opt => opt.trim()).filter(opt => opt)
      : undefined

    const newFieldConfig: FieldConfig = {
      id: fieldId,
      name: newField.name,
      label: newField.label,
      description: newField.description,
      enabled: true,
      position: currentFields.length + 1,
      category: newField.category,
      iconName: newField.iconName,
      inputType: newField.inputType,
      options,
      searchable: newField.inputType === 'select' ? newField.searchable : undefined
    }

    const updatedFields = [...currentFields, newFieldConfig]
    setCurrentFields(updatedFields)

    // Reset form
    setNewField({
      name: '',
      label: '',
      description: '',
      category: 'basic',
      iconName: 'User',
      inputType: 'text',
      options: '',
      searchable: false
    })
    setShowAddField(false)
    toast.success(`Added field: ${newField.label}`)
  }

  // Show loading spinner when initially loading data
  if (loading && studentFields.length === 0 && courseFields.length === 0 && branchFields.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading form configurations...</p>
        </div>
      </div>
    )
  }

  const formOptions = [
    { 
      key: 'student' as FormType, 
      label: 'Student Form', 
      icon: <GraduationCap className="h-5 w-5" />,
      description: 'Configure student registration fields'
    },
    { 
      key: 'course' as FormType, 
      label: 'Course Form', 
      icon: <BookOpen className="h-5 w-5" />,
      description: 'Configure course creation fields'
    },
    { 
      key: 'branch' as FormType, 
      label: 'Branch Form', 
      icon: <Building className="h-5 w-5" />,
      description: 'Configure branch setup fields'
    },
    // Add custom forms
    ...customForms.map(form => ({
      key: form.id as FormType,
      label: form.label,
      icon: <Edit3 className="h-5 w-5" />,
      description: form.description
    }))
  ]

  // Get current fields for the active form
  const currentFields = [...getCurrentFields()].sort((a, b) => a.position - b.position)
  const enabledCount = currentFields.filter(field => field.enabled).length
  
  // Group fields by category for display
  const groupedFields = currentFields.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = []
    }
    acc[field.category].push(field)
    return acc
  }, {} as Record<string, FieldConfig[]>)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex relative">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isDesktop={isDesktop}
        activeForm={activeForm}
        setActiveForm={setActiveForm}
        customForms={customForms}
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        newFormName={newFormName}
        setNewFormName={setNewFormName}
        createNewForm={createNewForm}
        enabledCount={enabledCount}
        totalFields={currentFields.length}
        resetToDefault={resetToDefault}
        saveConfiguration={saveConfiguration}
        loading={loading}
      />

      {/* Main Content */}
      <div className={`flex-1 p-6 transition-all duration-300 ${isDesktop ? '' : 'w-full'}`}>
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <FormHeader
            activeForm={activeForm}
            formOptions={formOptions}
            enabledCount={enabledCount}
            totalFields={currentFields.length}
            error={error}
          />

          {/* Form Order Preview */}
          <FormOrderPreview currentFields={currentFields} />

          {/* Field Configuration Cards */}
          <div className="grid gap-6">
            {Object.entries(groupedFields).map(([category, fields]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </CardTitle>
                  <Separator />
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {fields.map((field) => {
                      // Get the global position among all fields
                      const globalIndex = currentFields.findIndex(f => f.id === field.id)
                      
                      return (
                        <FieldConfigCard
                          key={field.id}
                          field={field}
                          globalIndex={globalIndex}
                          onToggle={toggleField}
                          onDragStart={handleDragStart}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          onDelete={(fieldId) => {
                            const customFormIndex = customForms.findIndex(form => form.id === activeForm)
                            if (customFormIndex !== -1) {
                              const updatedForms = [...customForms]
                              updatedForms[customFormIndex].fields = updatedForms[customFormIndex].fields.filter(f => f.id !== fieldId)
                              setCustomForms(updatedForms)
                              toast.success(`Deleted field: ${field.label}`)
                            }
                          }}
                          showDeleteButton={isCreatingCustomForm}
                          getIcon={getIcon}
                        />
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Field Button */}
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => {
                console.log('Add Field button clicked!')
                setShowAddField(true)
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-3" />
              Add New Field to {formOptions.find(option => option.key === activeForm)?.label}
            </Button>
          </div>

          {/* Add Field Form */}
          <AddFieldForm
            isVisible={showAddField}
            onClose={() => setShowAddField(false)}
            newField={newField}
            setNewField={setNewField}
            onAddField={addFieldToForm}
            formName={formOptions.find(option => option.key === activeForm)?.label || ''}
          />

          {/* Footer Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>Changes will be applied to all future {activeForm} operations.</p>
                  <p className="mt-1">Current configuration: <span className="font-semibold">{enabledCount} fields enabled</span></p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={resetToDefault}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset All
                  </Button>
                  <Button 
                    onClick={saveConfiguration} 
                    disabled={loading}
                    className="min-w-[120px]"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminPanel
