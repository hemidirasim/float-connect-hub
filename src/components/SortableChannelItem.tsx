
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
      // Always pass both newValue and newLabel to ensure both are saved
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
      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
    >
      <div className="flex items-center gap-3 flex-1">
        <button
          className="cursor-grab hover:cursor-grabbing text-gray-400 hover:text-gray-600"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </button>
        
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
          style={{ backgroundColor: platform?.color || '#6b7280' }}
        >
          {channel.type === 'custom' && channel.customIcon ? (
            <img 
              src={channel.customIcon} 
              className="w-4 h-4 object-contain" 
              alt="Custom icon"
            />
          ) : (
            IconComponent && <IconComponent className="w-4 h-4" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <div>
                <Label htmlFor="edit-label" className="text-xs text-gray-600">Ad</Label>
                <Input
                  id="edit-label"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  className="text-sm"
                  placeholder="Kanal adı"
                />
              </div>
              <div>
                <Label htmlFor="edit-value" className="text-xs text-gray-600">Əlaqə məlumatı</Label>
                <Input
                  id="edit-value"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                  placeholder="Əlaqə məlumatı"
                />
              </div>
            </div>
          ) : (
            <>
              <p className="font-medium text-sm">{channel.label}</p>
              <p className="text-xs text-gray-600 truncate">{channel.value}</p>
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
              className="text-green-600 hover:text-green-700"
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancelEdit}
              className="text-gray-600 hover:text-gray-700"
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
              className="text-blue-600 hover:text-blue-700"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemove(channel.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
