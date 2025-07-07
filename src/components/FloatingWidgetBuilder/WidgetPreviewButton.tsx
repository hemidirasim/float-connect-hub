
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle } from 'lucide-react';
import { FormData } from './types';

interface WidgetPreviewButtonProps {
  formData: FormData;
  showWidget: boolean;
  onButtonClick: () => void;
}

export const WidgetPreviewButton: React.FC<WidgetPreviewButtonProps> = ({
  formData,
  showWidget,
  onButtonClick
}) => {
  if (!showWidget) return null;

  const buttonSize = formData.buttonSize || 60;
  const position = formData.position === 'left' ? 'left-4' : 'right-4';

  return (
    <div 
      className={`fixed bottom-4 ${position}`} 
      style={{ position: 'fixed', zIndex: 40 }}
    >
      <div className="relative group">
        {/* Tooltip */}
        {formData.tooltip && formData.tooltipDisplay === 'hover' && (
          <div className={`absolute bottom-full mb-2 ${formData.position === 'left' ? 'left-0' : 'right-0'} 
            bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            ${formData.tooltipPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
            {formData.tooltip}
            <div className={`absolute ${formData.tooltipPosition === 'top' ? 'top-full' : 'bottom-full'} 
              ${formData.position === 'left' ? 'left-4' : 'right-4'} 
              w-0 h-0 border-l-4 border-r-4 border-transparent
              ${formData.tooltipPosition === 'top' ? 'border-t-4 border-t-gray-800' : 'border-b-4 border-b-gray-800'}`}>
            </div>
          </div>
        )}
        
        <Button
          onClick={onButtonClick}
          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          style={{
            backgroundColor: formData.buttonColor,
            width: `${buttonSize}px`,
            height: `${buttonSize}px`,
            padding: 0,
            border: 'none'
          }}
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      </div>
    </div>
  );
};
