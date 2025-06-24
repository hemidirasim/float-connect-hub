
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette } from 'lucide-react';

// Import templates to get their actual names and descriptions
import { getDefaultTemplate } from '../../../supabase/functions/widget-js/default-template';
import { getDarkTemplate } from '../../../supabase/functions/widget-js/templates/dark-template';
import { getMinimalTemplate } from '../../../supabase/functions/widget-js/templates/minimal-template';
import { getModernTemplate } from '../../../supabase/functions/widget-js/templates/modern-template';
import { getElegantTemplate } from '../../../supabase/functions/widget-js/templates/elegant-template';

// Get template definitions dynamically
const AVAILABLE_TEMPLATES = [
  { ...getDefaultTemplate(), is_default: true },
  { ...getDarkTemplate(), is_default: false },
  { ...getMinimalTemplate(), is_default: false },
  { ...getModernTemplate(), is_default: false },
  { ...getElegantTemplate(), is_default: false }
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
