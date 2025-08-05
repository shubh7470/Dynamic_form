import React from 'react'
import { GripVertical, Trash2 } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { FieldConfig } from '../types'

interface FieldConfigCardProps {
  field: FieldConfig
  globalIndex: number
  onToggle: (fieldId: string) => void
  onDragStart: (e: React.DragEvent, fieldId: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, fieldId: string) => void
  onDelete?: (fieldId: string) => void
  showDeleteButton?: boolean
  getIcon: (iconName: string) => React.ReactNode
}

export const FieldConfigCard: React.FC<FieldConfigCardProps> = ({
  field,
  globalIndex,
  onToggle,
  onDragStart,
  onDragOver,
  onDrop,
  onDelete,
  showDeleteButton = false,
  getIcon
}) => {
  return (
    <div
      draggable={field.enabled}
      onDragStart={(e) => onDragStart(e, field.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, field.id)}
      className={`p-4 border rounded-lg transition-all duration-200 ${
        field.enabled
          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20 cursor-move'
          : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
      } ${field.enabled ? 'hover:shadow-md hover:scale-[1.02]' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          {/* Drag Handle and Position */}
          <div className={`flex flex-col items-center gap-2 ${
            field.enabled ? 'opacity-100' : 'opacity-50'
          }`}>
            {/* Position Badge */}
            <div className={`flex items-center justify-center w-10 h-8 rounded-lg text-sm font-bold border-2 ${
              field.enabled 
                ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700' 
                : 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700'
            }`}>
              {globalIndex + 1}
            </div>
            
            {/* Drag Handle */}
            {field.enabled && (
              <div 
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 shadow-sm cursor-grab active:cursor-grabbing transition-all duration-200"
                title="Drag to reorder"
              >
                <GripVertical className="h-4 w-4" />
              </div>
            )}
            
            {/* Form order indicator */}
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {field.enabled ? 'Drag to reorder' : 'Disabled'}
            </div>
          </div>

          <div className={`p-3 rounded-lg ${
            field.enabled 
              ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-400' 
              : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
          }`}>
            {getIcon(field.iconName)}
          </div>
          
          <div className="flex-1">
            <Label 
              htmlFor={field.id} 
              className={`font-medium cursor-pointer text-base ${
                field.enabled ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {field.label}
            </Label>
            <p className={`text-sm mt-1 ${
              field.enabled ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
            }`}>
              {field.description}
            </p>
            
            <div className="flex gap-2 mt-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                field.enabled 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-500'
              }`}>
                name: {field.name}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                field.enabled 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-500'
              }`}>
                type: {field.inputType}
              </span>
              
              {field.inputType === 'select' && field.options && (
                <>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    field.enabled 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-500'
                  }`}>
                    options: {field.options.length}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    field.enabled 
                      ? field.searchable 
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-500'
                  }`}>
                    {field.searchable ? 'searchable' : 'not searchable'}
                  </span>
                </>
              )}
            </div>
            
            {field.inputType === 'select' && field.options && field.enabled && (
              <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Available Options ({field.options.length}):
                </h5>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  {field.options.slice(0, 10).map((option, index) => (
                    <span 
                      key={index}
                      className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                    >
                      {option}
                    </span>
                  ))}
                  {field.options.length > 10 && (
                    <span className="inline-block px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded text-xs">
                      +{field.options.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <Switch
            id={field.id}
            checked={field.enabled}
            onCheckedChange={() => onToggle(field.id)}
          />
          {field.enabled && (
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
              Active
            </span>
          )}
          
          {/* Delete button for custom form fields */}
          {showDeleteButton && onDelete && (
            <button
              onClick={() => onDelete(field.id)}
              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              title="Delete field"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
