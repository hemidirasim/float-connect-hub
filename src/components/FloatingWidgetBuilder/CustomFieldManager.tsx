import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus } from 'lucide-react';
import { CustomField } from './types';

interface CustomFieldManagerProps {
  customFields: CustomField[];
  onCustomFieldsChange: (fields: CustomField[]) => void;
}

export const CustomFieldManager: React.FC<CustomFieldManagerProps> = ({
  customFields,
  onCustomFieldsChange
}) => {
  const [newField, setNewField] = useState({
    label: '',
    placeholder: '',
    required: false
  });

  const addCustomField = () => {
    if (!newField.label.trim()) return;
    
    const field: CustomField = {
      id: Date.now().toString(),
      label: newField.label.trim(),
      placeholder: newField.placeholder.trim() || newField.label.trim(),
      required: newField.required
    };
    
    onCustomFieldsChange([...customFields, field]);
    setNewField({ label: '', placeholder: '', required: false });
  };

  const removeCustomField = (id: string) => {
    onCustomFieldsChange(customFields.filter(field => field.id !== id));
  };

  const updateCustomField = (id: string, updates: Partial<CustomField>) => {
    onCustomFieldsChange(
      customFields.map(field => 
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Custom Fields</Label>
      
      {/* Existing custom fields */}
      {customFields.map((field) => (
        <div key={field.id} className="border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={field.required}
                onCheckedChange={(required) => updateCustomField(field.id, { required })}
              />
              <Label className="text-sm">Required</Label>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeCustomField(field.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-sm">Field Label</Label>
              <Input
                value={field.label}
                onChange={(e) => updateCustomField(field.id, { label: e.target.value })}
                placeholder="Company"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Placeholder</Label>
              <Input
                value={field.placeholder}
                onChange={(e) => updateCustomField(field.id, { placeholder: e.target.value })}
                placeholder="Your company name"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add new field */}
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Switch
            checked={newField.required}
            onCheckedChange={(required) => setNewField(prev => ({ ...prev, required }))}
          />
          <Label className="text-sm">Required</Label>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-sm">Field Label</Label>
            <Input
              value={newField.label}
              onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
              placeholder="Company"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Placeholder</Label>
            <Input
              value={newField.placeholder}
              onChange={(e) => setNewField(prev => ({ ...prev, placeholder: e.target.value }))}
              placeholder="Your company name"
            />
          </div>
        </div>
        
        <Button 
          onClick={addCustomField}
          disabled={!newField.label.trim()}
          size="sm"
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Custom Field
        </Button>
      </div>
    </div>
  );
};
