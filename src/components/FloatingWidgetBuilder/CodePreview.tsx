
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Check } from 'lucide-react';

interface CodePreviewProps {
  generatedCode: string;
  copied: boolean;
  onCopy: () => void;
}

export const CodePreview: React.FC<CodePreviewProps> = ({
  generatedCode,
  copied,
  onCopy
}) => {
  // Don't render anything if there's no generated code
  if (!generatedCode) {
    return null;
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Copy className="w-5 h-5 text-green-600" />
          Generated Code
        </CardTitle>
        <CardDescription>
          Copy and paste into your website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Textarea
              value={generatedCode}
              readOnly
              className="min-h-[150px] font-mono text-sm bg-gray-50"
            />
            <Button
              onClick={onCopy}
              size="sm"
              className="absolute top-2 right-2"
              variant="outline"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-1 text-sm">Installation:</h4>
            <p className="text-xs text-blue-700">
              Paste before closing &lt;/body&gt; tag
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
