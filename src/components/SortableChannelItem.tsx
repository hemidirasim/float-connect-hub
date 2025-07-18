
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GripVertical, Edit, Trash2, Check, X } from 'lucide-react';

interface Channel {
  id: string;
  type: string;
  value: string;
  label: string;
  customIcon?: string;
}

interface Platform {
  value: string;
  label: string;
  icon: any;
  color: string;
}

interface SortableChannelItemProps {
  channel: Channel;
  onEdit: (id: string, newValue: string, newLabel: string) => void;
  onRemove: (id: string) => void;
  platformOptions: Platform[];
}

export const SortableChannelItem: React.FC<SortableChannelItemProps> = ({
  channel,
  onEdit,
  onRemove,
  platformOptions
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(channel.value);
  const [editLabel, setEditLabel] = useState(channel.label);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: channel.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const platform = platformOptions.find(p => p.value === channel.type);
  const IconComponent = platform?.icon;

  const handleSaveEdit = () => {
    if (editValue.trim()) {
      onEdit(channel.id, editValue.trim(), editLabel.trim() || channel.label);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditValue(channel.value);
    setEditLabel(channel.label);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-4 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
    >
      <div className="flex items-center gap-4 flex-1">
        <button
          className="cursor-grab hover:cursor-grabbing text-gray-400 hover:text-purple-600 transition-colors duration-200 p-1 rounded-lg hover:bg-purple-100/50"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </button>
        
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300"
          style={{ 
            background: `linear-gradient(135deg, ${platform?.color || '#6b7280'}, ${platform?.color ? platform.color + '80' : '#6b728080'})` 
          }}
        >
          {channel.type === 'custom' && channel.customIcon ? (
            <img 
              src={channel.customIcon} 
              className="w-5 h-5 object-contain" 
              alt="Custom icon"
            />
          ) : (
            IconComponent && <IconComponent className="w-5 h-5" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <Label htmlFor="edit-label" className="text-xs font-medium text-gray-700 mb-1 block">Ad</Label>
                <Input
                  id="edit-label"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  className="text-sm bg-white/50 border-white/30 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-200"
                  placeholder="Kanal adı"
                />
              </div>
              <div>
                <Label htmlFor="edit-value" className="text-xs font-medium text-gray-700 mb-1 block">Əlaqə məlumatı</Label>
                <Input
                  id="edit-value"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="text-sm bg-white/50 border-white/30 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-200"
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                  placeholder="Əlaqə məlumatı"
                />
              </div>
            </div>
          ) : (
            <>
              <p className="font-semibold text-sm text-gray-900 mb-1">{channel.label}</p>
              <p className="text-xs text-gray-600 truncate bg-gray-100/50 px-2 py-1 rounded-lg">{channel.value}</p>
            </>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSaveEdit}
              className="text-green-600 hover:text-green-700 hover:bg-green-100/50 rounded-xl transition-all duration-200"
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancelEdit}
              className="text-gray-600 hover:text-gray-700 hover:bg-gray-100/50 rounded-xl transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-100/50 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemove(channel.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-100/50 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

