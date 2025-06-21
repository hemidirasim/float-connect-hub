
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette } from 'lucide-react';

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  is_default: boolean;
}

// Static template list - no database needed
const AVAILABLE_TEMPLATES: TemplateOption[] = [
  {
    id: 'default',
    name: 'Default Template',
    description: 'Standard floating widget with modal popup',
    is_default: true
  },
  {
    id: 'dark',
    name: 'Dark Theme',
    description: 'Modern dark-themed widget with sleek design',
    is_default: false
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Clean and minimal design with subtle animations',
    is_default: false
  },
  {
    id: 'modern',
    name: 'Modern Gradient',
    description: 'Modern template with gradient effects and smooth animations',
    is_default: false
  }
];

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onTemplateChange: (templateId: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId,
  onTemplateChange
}) => {
  // Auto-select default template if none selected
  React.useEffect(() => {
    if (!selectedTemplateId) {
      const defaultTemplate = AVAILABLE_TEMPLATES.find(t => t.is_default) || AVAILABLE_TEMPLATES[0];
      onTemplateChange(defaultTemplate.id);
    }
  }, [selectedTemplateId, onTemplateChange]);

  const selectedTemplate = AVAILABLE_TEMPLATES.find(t => t.id === selectedTemplateId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-600" />
          Widget Template
        </CardTitle>
        <CardDescription>
          Choose the design template for your widget
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="template-select">Template</Label>
          <Select 
            value={selectedTemplateId} 
            onValueChange={onTemplateChange}
          >
            <SelectTrigger id="template-select">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_TEMPLATES.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  <div className="flex items-center gap-2">
                    <span>{template.name}</span>
                    {template.is_default && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedTemplate && (
            <div className="mt-2 text-sm text-gray-600">
              {selectedTemplate.description}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
