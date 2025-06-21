
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
      return;
    }

    const templateId = formData.templateId || 'default';
    const template = getTemplate(templateId);

    console.log('Generating floating widget preview:', {
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
    console.log('Floating widget preview generated:', html.length, 'characters');
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
          // Remove any existing preview widgets first
          const existingWidgets = document.querySelectorAll('[data-widget-preview]');
          existingWidgets.forEach(widget => widget.remove());

          // Create a temporary container to parse the HTML
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = previewHtml;
          
          // Add the HTML elements directly to document body
          const elements = tempDiv.children;
          Array.from(elements).forEach(element => {
            // Mark as preview widget for cleanup
            element.setAttribute('data-widget-preview', 'true');
            document.body.appendChild(element);
          });

          // Extract and execute scripts after DOM insertion
          const scripts = tempDiv.querySelectorAll('script');
          scripts.forEach(script => {
            if (script.textContent) {
              console.log('Executing floating widget script...');
              try {
                // Use setTimeout to ensure DOM elements are available
                setTimeout(() => {
                  eval(script.textContent);
                }, 100);
              } catch (e) {
                console.error('Script execution error:', e);
              }
            }
          });

        } catch (error) {
          console.error('Error rendering floating widget:', error);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [previewHtml]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const existingWidgets = document.querySelectorAll('[data-widget-preview]');
      existingWidgets.forEach(widget => widget.remove());
    };
  }, []);

  // Don't render any visible component - the widget is injected directly into the page
  return null;
};
