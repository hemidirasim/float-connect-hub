import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Channel, FormData } from './types';
import { TemplateRenderer, WidgetTemplate, TemplateConfig } from "@/utils/templateRenderer";

interface TemplatePreviewProps {
  showWidget: boolean;
  formData: FormData;
  channels: Channel[];
  editingWidget?: any;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  showWidget,
  formData,
  channels,
  editingWidget
}) => {
  const [template, setTemplate] = useState<WidgetTemplate | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Fetch selected template or default template
  useEffect(() => {
    const fetchTemplate = async () => {
      setLoading(true);
      try {
        let templateQuery = supabase.from('widget_templates').select('*');
        
        // If a specific template is selected, fetch it
        if (formData.templateId) {
          templateQuery = templateQuery.eq('id', formData.templateId);
        } else {
          // Otherwise fetch default template
          templateQuery = templateQuery.eq('is_default', true).eq('is_active', true);
        }

        const { data, error } = await templateQuery.single();

        if (error) {
          console.error('Error fetching template:', error);
          // Fallback to default template if specific template fails
          if (formData.templateId) {
            const { data: defaultData, error: defaultError } = await supabase
              .from('widget_templates')
              .select('*')
              .eq('is_default', true)
              .eq('is_active', true)
              .single();
            
            if (!defaultError && defaultData) {
              setTemplate(defaultData);
            }
          }
          return;
        }

        setTemplate(data);
      } catch (error) {
        console.error('Error fetching template:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [formData.templateId]);

  // Generate preview HTML when template or config changes
  useEffect(() => {
    if (!template || !showWidget || loading) {
      setPreviewHtml('');
      return;
    }

    const config: TemplateConfig = {
      channels,
      buttonColor: formData.buttonColor,
      position: formData.position,
      tooltip: formData.tooltip,
      tooltipDisplay: formData.tooltipDisplay,
      customIconUrl: formData.customIconUrl,
      videoEnabled: Boolean(formData.videoUrl),
      videoUrl: formData.videoUrl || editingWidget?.video_url,
      videoHeight: formData.videoHeight,
      videoAlignment: formData.videoAlignment,
      useVideoPreview: formData.useVideoPreview,
      buttonSize: formData.buttonSize,
      previewVideoHeight: formData.previewVideoHeight
    };

    const renderer = new TemplateRenderer(template, config);
    const html = renderer.renderComplete();
    setPreviewHtml(html);
  }, [template, formData, channels, showWidget, editingWidget, loading]);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="w-16 h-16 mx-auto mb-4 opacity-50 bg-gray-200 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-2xl">⏳</span>
        </div>
        <p>Loading template...</p>
      </div>
    );
  }

  if (!showWidget || !template) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="w-16 h-16 mx-auto mb-4 opacity-50 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-2xl">💬</span>
        </div>
        <p>Your website preview</p>
        <p className="text-sm">Widget appears below</p>
        {formData.templateId && (
          <p className="text-xs mt-2 text-purple-600">
            Using template: {template?.name || 'Loading...'}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="relative min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 opacity-50 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl">🌐</span>
          </div>
          <p>Your website preview</p>
          {template && (
            <p className="text-xs mt-2 text-purple-600">
              Template: {template.name}
            </p>
          )}
        </div>
      </div>
      
      {/* Template rendered widget */}
      <div 
        className="absolute inset-0 pointer-events-none"
        dangerouslySetInnerHTML={{ __html: previewHtml }}
        style={{ pointerEvents: 'auto' }}
      />
    </div>
  );
};
