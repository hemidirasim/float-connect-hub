
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-forwarded-for, user-agent',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
  'Access-Control-Expose-Headers': 'Last-Modified, ETag, X-Widget-Version, X-Widget-Template, X-Widget-Name',
  'Access-Control-Max-Age': '86400'
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

// Cache time - immediate updates for development
export const WIDGET_CACHE_TIME = 0 // No cache - immediate updates
