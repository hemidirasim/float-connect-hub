
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
      onSave(channel.id, value.trim(), label.trim() || channel.label);
      onClose();
    }
  };

  if (!channel) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kanal məlumatlarını redaktə et</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-value">Əlaqə məlumatı</Label>
            <Input
              id="edit-value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Əlaqə məlumatı daxil edin"
            />
          </div>
          <div>
            <Label htmlFor="edit-label">Xüsusi ad</Label>
            <Input
              id="edit-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Xüsusi ad (ixtiyari)"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Ləğv et
            </Button>
            <Button onClick={handleSave} disabled={!value.trim()}>
              Saxla
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
