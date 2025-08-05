import api from "../axiosInstance";
import ENDPOINTS from "../endpoints";

// Updated interfaces to match API documentation
export interface DynamicFormField {
  name: string;
  label: string;
  placeholder: string;
  type: 'text' | 'number' | 'email' | 'date' | 'tel' | 'file' | 'select' | 'textarea' | 'checkbox' | 'radio';  // Added missing types
  isActive: boolean;
  order: number;
  options?: { value: string }[];  // Changed to match backend schema
  isSearchable?: boolean;  // Added isSearchable property
}

// API expects fields as array, not object
export interface DynamicFormData {
  formType: 'student' | 'course' | 'branch';
  fields: DynamicFormField[];  // Changed from object to array
}

// API Response structure from documentation
export interface APIResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface DynamicFormResponse {
  _id: string;
  formType: 'student' | 'course' | 'branch';
  fields: { [key: string]: DynamicFormField };  // Backend returns as object
}

// Create dynamic form configuration (POST /)
export const createDynamicFormAPI = async (formData: DynamicFormData): Promise<APIResponse<DynamicFormResponse>> => {
  try {
    const response = await api.post(ENDPOINTS.DYNAMIC_FORMS, formData);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating dynamic form:', error);
    throw error;
  }
};

// Get dynamic form by type (GET /type/:formType)
export const getDynamicFormByTypeAPI = async (formType: string): Promise<APIResponse<DynamicFormResponse>> => {
  try {
    const response = await api.get(`${ENDPOINTS.DYNAMIC_FORMS}/type/${formType}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching dynamic form:', error);
    throw error;
  }
};

// Update dynamic form (PUT /:id)
export const updateDynamicFormAPI = async (id: string, formData: DynamicFormData): Promise<APIResponse<DynamicFormResponse>> => {
  try {
    const response = await api.put(`${ENDPOINTS.DYNAMIC_FORMS}/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error('❌ Error updating dynamic form:', error);
    throw error;
  }
};

// Helper function to convert frontend object to backend array format
export const convertFieldsToArray = (fieldsObject: { [key: string]: any }): DynamicFormField[] => {
  return Object.entries(fieldsObject).map(([key, field]) => ({
    name: field.name || key,
    label: field.label,
    placeholder: field.description || field.placeholder || '',
    type: field.inputType || field.type,
    isActive: field.enabled !== undefined ? field.enabled : field.isActive,
    order: field.position || field.order,
    options: field.options || []
  }));
};

// Helper function to convert backend array to frontend format
export const convertFieldsFromBackend = (backendFields: DynamicFormField[] | { [key: string]: any }) => {
  // Handle both array and object formats
  let fieldsArray: DynamicFormField[] = [];
  
  if (Array.isArray(backendFields)) {
    fieldsArray = backendFields;
  } else {
    // Convert object to array
    fieldsArray = Object.entries(backendFields || {}).map(([key, field]: [string, any]) => ({
      name: field.name || key,
      label: field.label,
      placeholder: field.placeholder || '',
      type: field.type,
      isActive: field.isActive,
      order: field.order,
      options: field.options || [],
      isSearchable: field.isSearchable || false
    }));
  }

  return fieldsArray.map((field: DynamicFormField) => ({
    id: field.name,
    name: field.name,
    label: field.label,
    description: field.placeholder || '',
    enabled: field.isActive,
    position: field.order,
    category: 'basic' as const,
    iconName: 'User',
    inputType: field.type as 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file',
    // Convert backend options format { value: string }[] to frontend string[]
    options: field.options ? field.options.map((opt: { value: string } | string) => 
      typeof opt === 'string' ? opt : opt.value
    ) : [],
    searchable: field.isSearchable || false
  }));
};

// Backward compatibility - wrapper functions
export const saveDynamicFormAPI = createDynamicFormAPI;
export const getDynamicFormAPI = getDynamicFormByTypeAPI;
