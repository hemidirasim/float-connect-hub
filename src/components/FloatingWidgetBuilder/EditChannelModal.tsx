
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Channel } from './types';

interface EditChannelModalProps {
  channel: Channel | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, newValue: string, newLabel: string) => void;
}

export const EditChannelModal: React.FC<EditChannelModalProps> = ({
  channel,
  isOpen,
  onClose,
  onSave
}) => {
  const [value, setValue] = useState(channel?.value || '');
  const [label, setLabel] = useState(channel?.label || '');

  React.useEffect(() => {
    if (channel) {
      setValue(channel.value);
      setLabel(channel.label);
    }
  }, [channel]);

  const handleSave = () => {
    if (channel && value.trim()) {
      // Ensure video URLs are properly formatted for autoplay
      let processedValue = value.trim();
      
      // If it's a video URL, make sure it supports autoplay
      if (processedValue.includes('youtube.com') || processedValue.includes('youtu.be')) {
        if (!processedValue.includes('autoplay=1')) {
          processedValue += processedValue.includes('?') ? '&autoplay=1&mute=1' : '?autoplay=1&mute=1';
        }
      }
      
      onSave(channel.id, processedValue, label.trim() || channel.label);
      onClose();
    }
  };

  if (!channel) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Channel Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-value">Contact Information</Label>
            <Input
              id="edit-value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter contact information"
            />
          </div>
          <div>
            <Label htmlFor="edit-label">Custom Name</Label>
            <Input
              id="edit-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Custom name (optional)"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!value.trim()}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
