
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-forwarded-for, user-agent',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
  'Access-Control-Expose-Headers': 'x-widget-version, x-widget-template, x-widget-name'
}

export const defaultWidgetConfig = {
  buttonColor: '#5422c9',
  position: 'right',
  tooltip: 'Contact us!',
  tooltipDisplay: 'hover',
  customIconUrl: '',
  videoEnabled: false,
  videoUrl: '',
  videoHeight: 200,
  videoAlignment: 'center'
}

// Remove cache limit - changes will appear immediately
export const WIDGET_CACHE_TIME = 0 // No cache - immediate updates
