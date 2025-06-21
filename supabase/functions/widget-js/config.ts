
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

export const defaultWidgetConfig = {
  buttonColor: '#25d366',
  position: 'right',
  tooltip: 'Contact us!',
  tooltipDisplay: 'hover',
  customIconUrl: '',
  videoEnabled: false,
  videoUrl: '',
  videoHeight: 200,
  videoAlignment: 'center'
}

// Reduced cache time for faster updates
export const WIDGET_CACHE_TIME = 60 // 1 minute instead of 5 minutes
