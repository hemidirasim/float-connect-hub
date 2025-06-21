
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

  // Fetch default template
  useEffect(() => {
    const fetchTemplate = async () => {
      const { data, error } = await supabase
        .from('widget_templates')
        .select('*')
        .eq('is_default', true)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching template:', error);
        return;
      }

      setTemplate(data);
    };

    fetchTemplate();
  }, []);

  // Generate preview HTML when template or config changes
  useEffect(() => {
    if (!template || !showWidget) {
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
  }, [template, formData, channels, showWidget, editingWidget]);

  if (!showWidget || !template) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="w-16 h-16 mx-auto mb-4 opacity-50 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-2xl">💬</span>
        </div>
        <p>Your website preview</p>
        <p className="text-sm">Widget appears below</p>
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
