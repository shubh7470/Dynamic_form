import React from 'react'
import { 
  Settings, 
  X, 
  BookOpen, 
  Building, 
  Edit3, 
  Plus,
  RotateCcw,
  Save,
  Menu
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FormType } from '../types'

interface SidebarProps {
  // Display state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  isDesktop: boolean
  
  // Form selection
  activeForm: FormType
  setActiveForm: (form: FormType) => void
  
  // Custom forms
  customForms: Array<{
    id: string
    label: string
    description: string
  }>
  
  // Add new form
  showAddForm: boolean
  setShowAddForm: (show: boolean) => void
  newFormName: string
  setNewFormName: (name: string) => void
  createNewForm: () => void
  
  // Field statistics
  enabledCount: number
  totalFields: number
  
  // Actions
  resetToDefault: () => void
  saveConfiguration: () => void
  loading: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  isDesktop,
  activeForm,
  setActiveForm,
  customForms,
  showAddForm,
  setShowAddForm,
  newFormName,
  setNewFormName,
  createNewForm,
  enabledCount,
  totalFields,
  resetToDefault,
  saveConfiguration,
  loading
}) => {
  const formOptions = [
    { 
      key: 'student' as FormType, 
      label: 'Student Form', 
      icon: <Edit3 className="h-5 w-5" />,
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

  return (
    <>
      {/* Backdrop Blur Overlay - Only show on mobile when sidebar is open */}
      {!isDesktop && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - Always visible on desktop, toggleable on mobile */}
      <div className={`${
        isDesktop 
          ? 'relative w-80 flex-shrink-0' // Desktop: always visible, takes up space
          : `fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ease-out w-80 shadow-2xl ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }` // Mobile: slide overlay
      } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}>
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Super Admin</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Form Configuration</p>
              </div>
            </div>
            {/* Close button only visible on mobile */}
            {!isDesktop && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all duration-200 group lg:hidden"
                title="Close sidebar"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Form Types Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Form Types
              </h3>
              {formOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setActiveForm(option.key)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                    activeForm === option.key
                      ? 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg scale-[1.02]'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:scale-[1.01] hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg transition-all duration-200 ${
                      activeForm === option.key 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 group-hover:bg-primary/10 group-hover:text-primary'
                    }`}>
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold transition-colors ${
                        activeForm === option.key ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {option.label}
                      </div>
                      <div className={`text-sm mt-1 transition-colors ${
                        activeForm === option.key 
                          ? 'text-white/80' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {option.description}
                      </div>
                    </div>
                    {activeForm === option.key && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </div>
                </button>
              ))}

              {/* Add New Form Button */}
              {!showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full text-left p-4 rounded-xl transition-all duration-200 group border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-200">
                      <Plus className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                        Add New Form
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Create a custom form type
                      </div>
                    </div>
                  </div>
                </button>
              ) : (
                <div className="p-4 border-2 border-primary rounded-xl bg-primary/5 dark:bg-primary/10">
                  <div className="space-y-3">
                    <Label htmlFor="formName" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Enter Form Name
                    </Label>
                    <Input
                      id="formName"
                      value={newFormName}
                      onChange={(e) => setNewFormName(e.target.value)}
                      placeholder="e.g., Teacher Form, Employee Form"
                      className="w-full"
                      onKeyPress={(e) => e.key === 'Enter' && createNewForm()}
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={createNewForm}
                        className="flex-1"
                        disabled={!newFormName.trim()}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setShowAddForm(false)
                          setNewFormName('')
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex items-center justify-between">
              <span>Fields Status:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {enabledCount} enabled
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${totalFields > 0 ? (enabledCount / totalFields) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetToDefault} 
              className="flex-1 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-all duration-200"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button 
              size="sm" 
              onClick={saveConfiguration} 
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Toggle Button - Only show on mobile when sidebar is closed */}
      {!isDesktop && !sidebarOpen && (
        <div className="fixed top-6 left-6 z-30 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="group relative p-4 bg-gradient-to-br from-primary to-primary/80 text-white rounded-2xl shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse hover:animate-none"
            title="Open sidebar"
          >
            <Menu className="h-6 w-6 transition-transform group-hover:rotate-180 duration-300" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-bounce" />
          </button>
        </div>
      )}
    </>
  )
}
