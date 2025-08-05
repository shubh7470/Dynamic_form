import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { NewFieldForm } from '../types'

interface AddFieldFormProps {
  isVisible: boolean
  onClose: () => void
  newField: NewFieldForm
  setNewField: React.Dispatch<React.SetStateAction<NewFieldForm>>
  onAddField: () => void
  formName: string
}

export const AddFieldForm: React.FC<AddFieldFormProps> = ({
  isVisible,
  onClose,
  newField,
  setNewField,
  onAddField,
  formName
}) => {
  if (!isVisible) return null

  const handleClose = () => {
    onClose()
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
  }

  return (
    <Card className="border-2 border-green-500">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-green-800 dark:text-green-200">
          Add New Field to {formName}
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fieldName">Field Name *</Label>
            <Input
              id="fieldName"
              value={newField.name}
              onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., teacherName, employeeId"
            />
          </div>
          <div>
            <Label htmlFor="fieldLabel">Field Label *</Label>
            <Input
              id="fieldLabel"
              value={newField.label}
              onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
              placeholder="e.g., Teacher Name, Employee ID"
            />
          </div>
          <div>
            <Label htmlFor="fieldDescription">Description</Label>
            <Input
              id="fieldDescription"
              value={newField.description}
              onChange={(e) => setNewField(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the field"
            />
          </div>
          <div>
            <Label htmlFor="fieldCategory">Category</Label>
            <Select 
              value={newField.category} 
              onValueChange={(value: 'basic' | 'details' | 'status' | 'contact') => 
                setNewField(prev => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic Information</SelectItem>
                <SelectItem value="details">Details</SelectItem>
                <SelectItem value="contact">Contact Information</SelectItem>
                <SelectItem value="status">Status Information</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="fieldInputType">Input Type</Label>
            <Select 
              value={newField.inputType} 
              onValueChange={(value: any) => setNewField(prev => ({ ...prev, inputType: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="tel">Phone</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="select">Select/Dropdown</SelectItem>
                <SelectItem value="textarea">Textarea</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="radio">Radio</SelectItem>
                <SelectItem value="file">File Upload</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="fieldIcon">Icon</Label>
            <Select 
              value={newField.iconName} 
              onValueChange={(value) => setNewField(prev => ({ ...prev, iconName: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="GraduationCap">Graduation Cap</SelectItem>
                <SelectItem value="MapPin">Map Pin</SelectItem>
                <SelectItem value="Calendar">Calendar</SelectItem>
                <SelectItem value="UserCheck">User Check</SelectItem>
                <SelectItem value="Building">Building</SelectItem>
                <SelectItem value="BookOpen">Book Open</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {newField.inputType === 'select' && (
          <div className="space-y-2">
            <Label htmlFor="fieldOptions">Options (comma-separated)</Label>
            <Input
              id="fieldOptions"
              value={newField.options}
              onChange={(e) => setNewField(prev => ({ ...prev, options: e.target.value }))}
              placeholder="Option 1, Option 2, Option 3"
            />
            <div className="flex items-center space-x-2">
              <Switch
                id="searchable"
                checked={newField.searchable}
                onCheckedChange={(checked) => setNewField(prev => ({ ...prev, searchable: checked }))}
              />
              <Label htmlFor="searchable" className="text-sm">Make this dropdown searchable</Label>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={onAddField} 
            disabled={!newField.name.trim() || !newField.label.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Field
          </Button>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
