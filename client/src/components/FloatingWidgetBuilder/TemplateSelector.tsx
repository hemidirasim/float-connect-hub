
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Palette } from 'lucide-react';

// Yalnız default template-i göstəririk
const DEFAULT_TEMPLATE = {
  id: 'default',
  name: 'Standart Dizayn',
  description: 'Klassik və asan istifadə edilən dizayn',
  is_default: true
};

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onTemplateChange: (templateId: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId,
  onTemplateChange
}) => {
  // Auto-select default template
  React.useEffect(() => {
    if (!selectedTemplateId || selectedTemplateId !== 'default') {
      onTemplateChange('default');
    }
  }, [selectedTemplateId, onTemplateChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-600" />
          Widget Dizaynı
        </CardTitle>
        <CardDescription>
          Widget-inizin dizaynı (indiki vaxtda yalnız standart dizayn mövcuddur)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="template-info">Seçilmiş Template</Label>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="font-medium">{DEFAULT_TEMPLATE.name}</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Aktiv
              </span>
            </div>
            <div className="mt-1 text-sm text-gray-600">
              {DEFAULT_TEMPLATE.description}
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            * Yeni dizaynlar tezliklə əlavə ediləcək
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
