import React, { useEffect, useState, useCallback } from 'react';
import { Channel, FormData } from './types';

// Template definitions matching server-side templates
const TEMPLATE_REGISTRY = {
  'default': {
    id: 'default',
    name: 'Modern Clean Template',
    description: 'Modern and clean floating widget with green accent'
  },
  'dark': {
    id: 'dark', 
    name: 'Dark Theme',
    description: 'Dark themed widget with modern styling'
  },
  'minimal': {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and minimal widget design'
  },
  'modern': {
    id: 'modern',
    name: 'Modern',
    description: 'Modern widget with contemporary styling'
  },
  'elegant': {
    id: 'elegant',
    name: 'Elegant',
    description: 'Elegant widget with sophisticated design'
  }
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

  // Generate preview HTML - simplified version for preview only
  useEffect(() => {
    if (!showWidget) {
      setPreviewHtml('');
      return;
    }

    const templateId = formData.templateId || 'default';
    const template = TEMPLATE_REGISTRY[templateId as keyof typeof TEMPLATE_REGISTRY] || TEMPLATE_REGISTRY['default'];

    // Generate a simple preview HTML for demonstration
    const previewHtml = `
      <style>
        #widget-preview-button {
          position: fixed;
          bottom: 20px;
          ${formData.position === 'left' ? 'left: 20px;' : 'right: 20px;'}
          width: ${formData.buttonSize || 60}px;
          height: ${formData.buttonSize || 60}px;
          background: ${formData.buttonColor || '#25d366'};
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        #widget-preview-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }
        #widget-preview-tooltip {
          position: absolute;
          bottom: ${(formData.buttonSize || 60) + 10}px;
          ${formData.position === 'left' ? 'left: 0;' : 'right: 0;'}
          background: #2d3748;
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          display: none;
          z-index: 10000;
        }
        #widget-preview-button:hover #widget-preview-tooltip {
          display: block;
        }
      </style>
      <div id="widget-preview-button" data-widget-preview="true">
        <div style="color: white; font-size: 24px;">💬</div>
        <div id="widget-preview-tooltip">${formData.tooltip || 'Contact us!'}</div>
      </div>
    `;
    
    setPreviewHtml(previewHtml);
  }, [
    showWidget,
    formData.templateId,
    formData.buttonColor,
    formData.position,
    formData.tooltip,
    formData.buttonSize,
    channels
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
          
          // Add all elements to the body
          const elements = Array.from(tempDiv.children);
          elements.forEach(element => {
            element.setAttribute('data-widget-preview', 'true');
            document.body.appendChild(element);
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