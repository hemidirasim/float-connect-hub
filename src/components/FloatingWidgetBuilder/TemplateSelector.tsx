
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Palette } from 'lucide-react';

const AVAILABLE_TEMPLATES = [
  {
    id: 'default',
    name: 'Standard Design',
    description: 'Classic and easy-to-use design',
    is_default: true
  },
  {
    id: 'modern-floating',
    name: 'Modern Floating',
    description: 'Modern design that opens from bottom to top on click',
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
      onTemplateChange('default');
    }
  }, [selectedTemplateId, onTemplateChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-600" />
          Widget Design
        </CardTitle>
        <CardDescription>
          Choose your widget design
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Label htmlFor="template-selector">Select Template</Label>
          <RadioGroup
            value={selectedTemplateId}
            onValueChange={onTemplateChange}
            className="grid grid-cols-1 gap-4"
          >
            {AVAILABLE_TEMPLATES.map((template) => (
              <div key={template.id} className="flex items-start space-x-3">
                <RadioGroupItem 
                  value={template.id} 
                  id={template.id}
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <Label 
                    htmlFor={template.id}
                    className="font-medium cursor-pointer flex items-center gap-2"
                  >
                    {template.name}
                    {template.is_default && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};
