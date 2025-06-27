
import { Channel, FormData } from "@/components/FloatingWidgetBuilder/types";

export const generateWidgetCode = (
  websiteUrl: string,
  channels: Channel[],
  formData: FormData,
  widgetId?: string
): string => {
  // If we have a widget ID, use the simple script tag without template parameter
  // Template is now stored in database and will be automatically used
  if (widgetId) {
    return `<!-- Add this script to your website's HTML -->
<script src="https://ttzioshkresaqmsodhfb.supabase.co/functions/v1/widget-js/${widgetId}"></script>`;
  }

  // Fallback to basic static code (for preview)
  const channelsJson = JSON.stringify(channels);
  const configJson = JSON.stringify({
    ...formData,
    channels: channels,
    templateId: formData.templateId || 'default'
  });

  return `<!-- Add this script to your website's HTML -->
<script>
// Widget configuration
const widgetConfig = ${configJson};

// Widget will be generated dynamically
console.log('Widget config:', widgetConfig);
</script>`;
};
