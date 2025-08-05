import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { FormType } from '../types'

interface FormHeaderProps {
  activeForm: FormType
  formOptions: Array<{
    key: FormType
    label: string
    description: string
  }>
  enabledCount: number
  totalFields: number
  error: string | null
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  activeForm,
  formOptions,
  enabledCount,
  totalFields,
  error
}) => {
  const currentFormOption = formOptions.find(option => option.key === activeForm)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              {currentFormOption?.label} Configuration
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {currentFormOption?.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
              {enabledCount} / {totalFields} enabled
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Configure which input fields should be included in the {activeForm} form. 
              Use the toggle switches to enable or disable each field and drag the grip handle to reorder them.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
