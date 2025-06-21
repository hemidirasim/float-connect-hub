
import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette } from 'lucide-react';

interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  preview_image_url?: string;
  is_active: boolean;
  is_default: boolean;
}

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onTemplateChange: (templateId: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId,
  onTemplateChange
}) => {
  const [templates, setTemplates] = useState<WidgetTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('widget_templates')
        .select('*')
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .order('name');

      if (error) throw error;
      
      setTemplates(data || []);
      
      // If no template is selected and we have templates, select the default one
      if (!selectedTemplateId && data && data.length > 0) {
        const defaultTemplate = data.find(t => t.is_default) || data[0];
        onTemplateChange(defaultTemplate.id);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

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
            disabled={loading}
          >
            <SelectTrigger id="template-select">
              <SelectValue placeholder={loading ? "Loading templates..." : "Select a template"} />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
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
          
          {templates.length > 0 && selectedTemplateId && (
            <div className="mt-2 text-sm text-gray-600">
              {templates.find(t => t.id === selectedTemplateId)?.description}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
