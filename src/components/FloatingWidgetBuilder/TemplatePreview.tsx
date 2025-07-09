import React, { useEffect, useState, useCallback } from 'react';
import { Channel, FormData } from './types';

// Import template definitions from the same source as edge function
import { getDefaultTemplate } from '../../../supabase/functions/widget-js/default-template';
import { getDarkTemplate } from '../../../supabase/functions/widget-js/templates/dark-template';
import { getMinimalTemplate } from '../../../supabase/functions/widget-js/templates/minimal-template';
import { getModernTemplate } from '../../../supabase/functions/widget-js/templates/modern-template';
import { getElegantTemplate } from '../../../supabase/functions/widget-js/templates/elegant-template';

// Import the SAME template renderer as edge functions
import { WidgetTemplateRenderer } from '../../../supabase/functions/widget-js/template-generator';

// Use the same template registry as edge functions
const TEMPLATE_REGISTRY = {
  'default': getDefaultTemplate,
  'dark': getDarkTemplate,
  'minimal': getMinimalTemplate,
  'modern': getModernTemplate,
  'elegant': getElegantTemplate
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
  const getTemplate = useCallback((templateId: string) => {
    const templateFunction = TEMPLATE_REGISTRY[templateId as keyof typeof TEMPLATE_REGISTRY] || TEMPLATE_REGISTRY['default'];
    const template = templateFunction();
    return template;
  }, []);

  // Generate preview HTML when template or config changes - USE SAME SYSTEM AS EDGE FUNCTION
  useEffect(() => {
    if (!showWidget) {
      setPreviewHtml('');
      // Remove existing widgets when hiding
      const existingWidgets = document.querySelectorAll('[data-widget-preview]');
      existingWidgets.forEach(widget => widget.remove());
      return;
    }

    const templateId = formData.templateId || 'default';
    const template = getTemplate(templateId);

    console.log('Generating floating widget preview with SAME template system:', {
      templateId,
      templateName: template.name,
      channels: channels.length,
      buttonColor: formData.buttonColor,
      position: formData.position,
      greetingMessage: formData.greetingMessage
    });

    // Use EXACT SAME config structure as edge function template-generator.ts
    const templateConfig = {
      channels,
      buttonColor: formData.buttonColor,
      position: formData.position,
      tooltip: formData.tooltip,
      tooltipDisplay: formData.tooltipDisplay,
      tooltipPosition: formData.tooltipPosition,
      greetingMessage: formData.greetingMessage,
      customIconUrl: formData.customIcon === 'custom' ? formData.customIconUrl : null,
      videoEnabled: Boolean(formData.videoType === 'link' ? formData.videoLink : formData.videoUrl),
      videoUrl: formData.videoType === 'link' ? formData.videoLink : (formData.videoUrl || editingWidget?.video_url),
      videoHeight: formData.videoHeight,
      videoAlignment: formData.videoAlignment,
      videoObjectFit: formData.videoObjectFit,
      useVideoPreview: formData.useVideoPreview,
      buttonSize: formData.buttonSize,
      previewVideoHeight: formData.previewVideoHeight,
      templateId: templateId,
      widgetWidth: 400, // Default value
      widgetHeight: 600 // Default value
    };

    // Use SAME renderer as edge function
    const renderer = new WidgetTemplateRenderer(template, templateConfig);
    const completeScript = renderer.generateWidgetScript();
    
    // Parse and clean the generated script to extract HTML, CSS, and JS
    const htmlMatch = completeScript.match(/widgetDiv\.innerHTML = `([^`]+)`/);
    const cssMatch = completeScript.match(/style\.textContent = `([^`]+)`/);
    const jsMatch = completeScript.match(/\/\/ Execute JavaScript\s*([\s\S]*?)(?=\}\)\(\);)/);
    
    let finalHtml = '';
    
    if (htmlMatch && cssMatch) {
      const html = htmlMatch[1]
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\'/g, "'")
        .replace(/\\"/g, '"');
      
      const css = cssMatch[1]
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\'/g, "'")
        .replace(/\\"/g, '"');
      
      let js = '';
      if (jsMatch) {
        js = jsMatch[1]
          .replace(/\\n/g, '\n')
          .replace(/\\t/g, '\t')
          .replace(/\\'/g, "'")
          .replace(/\\"/g, '"');
      }
      
      finalHtml = `
        <style>${css}</style>
        ${html}
        <script>
          (function() {
            ${js}
          })();
        </script>
      `;
    } else {
      // Fallback - use the complete script
      finalHtml = `<div id="temp-container"></div><script>${completeScript}</script>`;
    }
    
    setPreviewHtml(finalHtml);
    console.log('Floating widget preview generated using SAME system as edge function');
  }, [
    showWidget,
    formData.templateId,
    formData.buttonColor,
    formData.position,
    formData.tooltip,
    formData.tooltipDisplay,
    formData.tooltipPosition,
    formData.greetingMessage,
    formData.customIconUrl,
    formData.videoUrl,
    formData.videoLink,
    formData.videoType,
    formData.videoHeight,
    formData.videoAlignment,
    formData.videoObjectFit,
    formData.useVideoPreview,
    formData.buttonSize,
    formData.previewVideoHeight,
    channels,
    editingWidget?.video_url,
    getTemplate
  ]);

  // Execute inline scripts after HTML is inserted
  useEffect(() => {
    // Always remove existing widgets first (even if no new previewHtml)
    const existingWidgets = document.querySelectorAll('[data-widget-preview]');
    existingWidgets.forEach(widget => widget.remove());
    
    if (previewHtml) {
      const timer = setTimeout(() => {
        try {

          // Create a temporary container to parse the HTML
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = previewHtml;
          
          // Add all elements to the body
          const elements = Array.from(tempDiv.children);
          elements.forEach(element => {
            element.setAttribute('data-widget-preview', 'true');
            document.body.appendChild(element);
          });

          // Wait a bit for DOM to be ready, then execute any inline scripts
          setTimeout(() => {
            // Find and execute script tags
            const scripts = document.querySelectorAll('script[data-widget-preview]');
            scripts.forEach(script => {
              if (script.textContent && script.textContent.trim()) {
                console.log('Executing widget script for preview...');
                try {
                  // Create a new function from the script content and execute it
                  const scriptContent = script.textContent;
                  const scriptFunction = new Function(scriptContent);
                  scriptFunction();
                } catch (e) {
                  console.error('Script execution error:', e);
                }
              }
            });
          }, 100);

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
