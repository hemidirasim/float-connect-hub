
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface WebsiteInfoFormProps {
  websiteName: string;
  websiteUrl: string;
  onWebsiteNameChange: (value: string) => void;
  onWebsiteUrlChange: (value: string) => void;
}

export const WebsiteInfoForm: React.FC<WebsiteInfoFormProps> = ({
  websiteName,
  websiteUrl,
  onWebsiteNameChange,
  onWebsiteUrlChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="websiteName">Website Adı <span className="text-red-500">*</span></Label>
        <Input
          id="websiteName"
          placeholder="Məsələn: Ana Səhifə"
          value={websiteName}
          onChange={(e) => onWebsiteNameChange(e.target.value)}
          className="w-full"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="website">Website URL <span className="text-red-500">*</span></Label>
        <Input
          id="website"
          placeholder="https://hiclient.co"
          value={websiteUrl}
          onChange={(e) => onWebsiteUrlChange(e.target.value)}
          className="w-full"
          required
        />
      </div>
    </div>
  );
};
