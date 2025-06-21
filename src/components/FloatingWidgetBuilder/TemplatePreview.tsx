
import React, { useEffect, useState, useCallback } from 'react';
import { Channel, FormData } from './types';
import { TemplateRenderer, WidgetTemplate, TemplateConfig } from "@/utils/templateRenderer";

// Import template definitions from the same source as edge function
import { getDefaultTemplate } from '../../../supabase/functions/widget-js/default-template';
import { getDarkTemplate } from '../../../supabase/functions/widget-js/templates/dark-template';
import { getMinimalTemplate } from '../../../supabase/functions/widget-js/templates/minimal-template';
import { getModernTemplate } from '../../../supabase/functions/widget-js/templates/modern-template';

// Use the same template registry as edge functions
const TEMPLATE_REGISTRY = {
  'default': getDefaultTemplate,
  'dark': getDarkTemplate,
  'minimal': getMinimalTemplate,
  'modern': getModernTemplate
} as const;

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
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Memoize template getter to prevent infinite re-renders
  const getTemplate = useCallback((templateId: string): WidgetTemplate => {
    const templateFunction = TEMPLATE_REGISTRY[templateId as keyof typeof TEMPLATE_REGISTRY] || TEMPLATE_REGISTRY['default'];
    const template = templateFunction();
    return template;
  }, []);

  // Generate preview HTML when template or config changes
  useEffect(() => {
    if (!showWidget) {
      setPreviewHtml('');
      setDebugInfo('');
      return;
    }

    const templateId = formData.templateId || 'default';
    const template = getTemplate(templateId);

    console.log('Generating preview with synchronized template:', {
      templateId,
      templateName: template.name,
      channels: channels.length,
      buttonColor: formData.buttonColor,
      position: formData.position
    });

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
    setDebugInfo(`Preview generated: ${template.name} (synchronized with edge function)`);
    console.log('Preview HTML generated with synchronized template:', html.length, 'characters');
  }, [
    showWidget,
    formData.templateId,
    formData.buttonColor,
    formData.position,
    formData.tooltip,
    formData.tooltipDisplay,
    formData.customIconUrl,
    formData.videoUrl,
    formData.videoHeight,
    formData.videoAlignment,
    formData.useVideoPreview,
    formData.buttonSize,
    formData.previewVideoHeight,
    channels,
    editingWidget?.video_url,
    getTemplate
  ]);

  // Execute inline scripts after HTML is inserted
  useEffect(() => {
    if (previewHtml) {
      const timer = setTimeout(() => {
        try {
          const previewContainer = document.querySelector('[data-preview-container]');
          if (previewContainer) {
            const scripts = previewContainer.querySelectorAll('script');
            scripts.forEach(script => {
              if (script.textContent) {
                console.log('Executing synchronized preview script...');
                try {
                  eval(script.textContent);
                } catch (e) {
                  console.error('Script execution error:', e);
                }
              }
            });
          }
        } catch (error) {
          console.error('Error executing preview scripts:', error);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [previewHtml]);

  if (!showWidget) {
    const templateId = formData.templateId || 'default';
    const template = getTemplate(templateId);
    
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="w-16 h-16 mx-auto mb-4 opacity-50 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-2xl">💬</span>
        </div>
        <p>Your website preview</p>
        <p className="text-sm">Widget appears below</p>
        <p className="text-xs mt-2 text-purple-600">
          Template: {template.name}
        </p>
        <p className="text-xs mt-2 text-blue-600">{debugInfo}</p>
      </div>
    );
  }

  const templateId = formData.templateId || 'default';
  const template = getTemplate(templateId);

  return (
    <div className="relative min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 opacity-50 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl">🌐</span>
          </div>
          <p>Your website preview</p>
          <p className="text-xs mt-2 text-purple-600">
            Template: {template.name}
          </p>
          <p className="text-xs mt-1 text-blue-600">{debugInfo}</p>
        </div>
      </div>
      
      {/* Template rendered widget */}
      <div 
        className="absolute inset-0"
        data-preview-container
        dangerouslySetInnerHTML={{ __html: previewHtml }}
        style={{ pointerEvents: 'auto' }}
      />
    </div>
  );
};
