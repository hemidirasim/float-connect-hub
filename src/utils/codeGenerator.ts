
import { Channel, FormData } from "@/components/FloatingWidgetBuilder/types";

export const generateWidgetCode = (
  websiteUrl: string,
  channels: Channel[],
  formData: FormData,
  widgetId?: string
): string => {
  // If we have a widget ID, use the dynamic script with auto-refresh capability
  if (widgetId) {
    const templateId = formData.templateId || 'default';
    return `<!-- Add this script to your website's HTML (no need to update after changes) -->
<script>
// Widget Auto-Update Configuration
(function() {
  var widgetId = '${widgetId}';
  var templateId = '${templateId}';
  var checkInterval = 60000; // Check for updates every 60 seconds
  var lastUpdated = null;
  var widgetContainer = null;
  
  // Function to load widget
  function loadWidget() {
    var script = document.createElement('script');
    script.src = 'https://ttzioshkresaqmsodhfb.supabase.co/functions/v1/widget-js/' + widgetId + '?template=' + templateId + '&t=' + Date.now();
    script.onload = function() {
      console.log('Widget loaded successfully');
    };
    script.onerror = function() {
      console.log('Widget failed to load, retrying in 30 seconds...');
      setTimeout(loadWidget, 30000);
    };
    document.head.appendChild(script);
  }
  
  // Function to check for updates
  function checkForUpdates() {
    fetch('https://ttzioshkresaqmsodhfb.supabase.co/functions/v1/widget-js/' + widgetId + '?template=' + templateId, {
      method: 'HEAD'
    })
    .then(function(response) {
      var serverLastModified = response.headers.get('Last-Modified');
      if (serverLastModified && lastUpdated && serverLastModified !== lastUpdated) {
        console.log('Widget update detected, refreshing...');
        // Remove existing widget
        var existingWidget = document.querySelector('.hiclient-widget-button');
        var existingModal = document.querySelector('.hiclient-modal-backdrop');
        if (existingWidget) existingWidget.remove();
        if (existingModal) existingModal.remove();
        
        // Reload widget
        loadWidget();
      }
      lastUpdated = serverLastModified;
    })
    .catch(function(error) {
      console.log('Update check failed:', error);
    });
  }
  
  // Initial load
  loadWidget();
  
  // Set up periodic update checks
  setInterval(checkForUpdates, checkInterval);
  
  // Check for updates when page becomes visible (user returns to tab)
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      checkForUpdates();
    }
  });
  
})();
</script>`;
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
