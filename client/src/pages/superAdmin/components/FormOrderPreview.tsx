import React from 'react'
import type { FieldConfig } from '../types'

interface FormOrderPreviewProps {
  currentFields: FieldConfig[]
}

export const FormOrderPreview: React.FC<FormOrderPreviewProps> = ({
  currentFields
}) => {
  const enabledFields = currentFields.filter(field => field.enabled)

  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
        Current Form Order ({enabledFields.length} enabled fields):
      </h4>
      <div className="flex flex-wrap gap-2">
        {enabledFields.map((field, index) => (
          <span
            key={field.id}
            className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium"
          >
            <span className="bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {index + 1}
            </span>
            {field.label}
          </span>
        ))}
        {enabledFields.length === 0 && (
          <span className="text-sm text-green-600 dark:text-green-400 italic">
            No fields enabled. Enable fields below to see the form order.
          </span>
        )}
      </div>
    </div>
  )
}
