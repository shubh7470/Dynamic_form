import React from "react"
import { User, GraduationCap, MapPin, Calendar, UserCheck, Building, BookOpen } from "lucide-react"
import type { FieldConfig } from '../pages/superAdmin/types'

// Icon mapping function
export const getIcon = (iconName: string): React.ReactNode => {
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

// Group fields by category
export const groupFieldsByCategory = (fields: FieldConfig[]): Record<string, FieldConfig[]> => {
  return fields.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = []
    }
    acc[field.category].push(field)
    return acc
  }, {} as Record<string, FieldConfig[]>)
}

// Move field up in the list
export const moveFieldUp = (
  fields: FieldConfig[], 
  fieldId: string
): { updatedFields: FieldConfig[]; movedItem?: FieldConfig } => {
  const currentFields = [...fields].sort((a, b) => a.position - b.position)
  const fieldIndex = currentFields.findIndex(field => field.id === fieldId)
  
  if (fieldIndex > 0) {
    const newFields = [...currentFields]
    // Simply swap the two adjacent items
    const [itemToMove] = newFields.splice(fieldIndex, 1)
    newFields.splice(fieldIndex - 1, 0, itemToMove)
    
    // Reassign positions based on new order
    const updatedFields = newFields.map((field, index) => ({
      ...field,
      position: index + 1
    }))
    
    return { updatedFields, movedItem: itemToMove }
  }
  
  return { updatedFields: fields }
}

// Move field down in the list
export const moveFieldDown = (
  fields: FieldConfig[], 
  fieldId: string
): { updatedFields: FieldConfig[]; movedItem?: FieldConfig } => {
  const currentFields = [...fields].sort((a, b) => a.position - b.position)
  const fieldIndex = currentFields.findIndex(field => field.id === fieldId)
  
  if (fieldIndex < currentFields.length - 1) {
    const newFields = [...currentFields]
    // Simply swap the two adjacent items
    const [itemToMove] = newFields.splice(fieldIndex, 1)
    newFields.splice(fieldIndex + 1, 0, itemToMove)
    
    // Reassign positions based on new order
    const updatedFields = newFields.map((field, index) => ({
      ...field,
      position: index + 1
    }))
    
    return { updatedFields, movedItem: itemToMove }
  }
  
  return { updatedFields: fields }
}

// Toggle field enabled state
export const toggleFieldEnabled = (fields: FieldConfig[], fieldId: string): FieldConfig[] => {
  return fields.map(field => 
    field.id === fieldId 
      ? { ...field, enabled: !field.enabled }
      : field
  )
}

// Reset fields to default enabled state
export const resetFieldsToDefault = (fields: FieldConfig[]): FieldConfig[] => {
  const defaultEnabledFields = ['name', 'email', 'contactNumber', 'address', 'isActive']
  return fields.map((field, index) => ({
    ...field,
    enabled: defaultEnabledFields.includes(field.name) || field.name.includes('Name') || field.name.includes('Code'),
    position: index + 1 // Reset positions to original order
  }))
}
