
-- Create widget templates table
CREATE TABLE IF NOT EXISTS public.widget_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  html_template TEXT NOT NULL,
  css_template TEXT NOT NULL,
  js_template TEXT NOT NULL,
  preview_image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add template_id to widgets table
ALTER TABLE public.widgets 
ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.widget_templates(id) DEFAULT NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_widget_templates_active ON public.widget_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_widgets_template_id ON public.widgets(template_id);

-- Insert default template
INSERT INTO public.widget_templates (name, description, html_template, css_template, js_template, is_default, is_active)
VALUES (
  'Default Template',
  'Standard floating widget with modal popup',
  '<!-- Default HTML Template -->
<div class="hiclient-widget-container" style="position: fixed; {{position}}: 20px; bottom: 20px; z-index: 99999;">
  <div class="hiclient-tooltip {{tooltip_class}}" style="{{tooltip_style}}">{{tooltip_text}}</div>
  <button class="hiclient-widget-button" style="{{button_style}}">
    {{button_icon}}
  </button>
</div>

<div class="hiclient-modal-backdrop">
  <div class="hiclient-modal-content">
    <div class="hiclient-modal-header">Contact Us</div>
    {{video_section}}
    {{channels_section}}
    {{empty_state}}
  </div>
</div>',
  
  '/* Default CSS Template */
.hiclient-widget-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.hiclient-widget-button {
  width: {{button_size}}px;
  height: {{button_size}}px;
  border-radius: 50%;
  background: {{button_color}};
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}

.hiclient-widget-button:hover {
  transform: scale(1.1);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.hiclient-tooltip {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 100000;
  transition: opacity 0.15s ease, visibility 0.15s ease;
  pointer-events: none;
}

.hiclient-tooltip.show {
  opacity: 1;
  visibility: visible;
}

.hiclient-tooltip.hide {
  opacity: 0;
  visibility: hidden;
}

.hiclient-tooltip::before {
  content: "";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
}

.hiclient-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.hiclient-modal-backdrop.show {
  opacity: 1;
  visibility: visible;
}

.hiclient-modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  max-width: 28rem;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  transform: scale(0.95);
  transition: transform 0.3s ease;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.hiclient-modal-backdrop.show .hiclient-modal-content {
  transform: scale(1);
}

.hiclient-modal-header {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  text-align: center;
  line-height: 1.4;
}

.hiclient-video-container {
  margin-bottom: 20px;
}

.hiclient-video-player {
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.hiclient-channels-container {
  max-height: 300px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.hiclient-channel-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  background: white;
}

.hiclient-channel-item:hover {
  background-color: #f9fafb;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.hiclient-channel-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hiclient-channel-info {
  flex: 1;
  min-width: 0;
}

.hiclient-channel-label {
  font-weight: 500;
  font-size: 14px;
  color: #374151;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.hiclient-channel-value {
  font-size: 12px;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  line-height: 1.3;
}

.hiclient-external-icon {
  width: 16px;
  height: 16px;
  color: #9ca3af;
  flex-shrink: 0;
}

.hiclient-empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.hiclient-empty-icon {
  width: 32px;
  height: 32px;
  margin: 0 auto 12px;
  opacity: 0.5;
}',

  '/* Default JS Template */
function renderWidget(config) {
  // Widget rendering logic
  console.log("Rendering widget with config:", config);
}',
  
  true,
  true
);

-- Insert modern template
INSERT INTO public.widget_templates (name, description, html_template, css_template, js_template, is_active)
VALUES (
  'Modern Template',
  'Modern design with gradient effects and smooth animations',
  '<!-- Modern HTML Template -->
<div class="hiclient-widget-container modern-style" style="position: fixed; {{position}}: 20px; bottom: 20px; z-index: 99999;">
  <div class="hiclient-tooltip modern-tooltip {{tooltip_class}}" style="{{tooltip_style}}">{{tooltip_text}}</div>
  <button class="hiclient-widget-button modern-button" style="{{button_style}}">
    {{button_icon}}
    <div class="pulse-ring"></div>
  </button>
</div>

<div class="hiclient-modal-backdrop modern-modal">
  <div class="hiclient-modal-content modern-content">
    <div class="hiclient-modal-header modern-header">Contact Us</div>
    {{video_section}}
    {{channels_section}}
    {{empty_state}}
  </div>
</div>',
  
  '/* Modern CSS Template */
.hiclient-widget-container.modern-style {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.hiclient-widget-button.modern-button {
  width: {{button_size}}px;
  height: {{button_size}}px;
  border-radius: 20px;
  background: linear-gradient(135deg, {{button_color}}, #ff6b6b);
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: visible;
}

.hiclient-widget-button.modern-button:hover {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
}

.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid {{button_color}};
  border-radius: 20px;
  animation: pulse 2s infinite;
  opacity: 0.6;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.3;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

.hiclient-tooltip.modern-tooltip {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  padding: 10px 16px;
  font-weight: 500;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.hiclient-modal-content.modern-content {
  border-radius: 24px;
  background: linear-gradient(145deg, #ffffff, #f8f9ff);
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hiclient-modal-header.modern-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 20px;
}',

  '/* Modern JS Template */
function renderWidget(config) {
  console.log("Rendering modern widget with config:", config);
}',
  
  true
);

-- Set RLS policies
ALTER TABLE public.widget_templates ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read active templates
CREATE POLICY "Allow read active templates" ON public.widget_templates
  FOR SELECT USING (is_active = true);

-- Allow authenticated users to read all templates
CREATE POLICY "Allow authenticated read templates" ON public.widget_templates
  FOR SELECT TO authenticated USING (true);
