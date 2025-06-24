# Minimalist Widget Template Implementation Guide

## Overview
The Minimalist Widget Template provides a clean, icon-based communication interface that emphasizes simplicity and usability. This implementation guide outlines how to integrate and customize the widget for your website.

## Implementation Steps

### 1. Basic Setup

Add the widget script to your website by including this code before the closing `</body>` tag:

```html
<script src="https://ttzioshkresaqmsodhfb.supabase.co/functions/v1/widget-js/YOUR_WIDGET_ID"></script>
```

Replace `YOUR_WIDGET_ID` with the unique identifier provided in your dashboard.

### 2. Customization Options

The widget supports the following customization parameters:

#### Visual Appearance
- **buttonColor**: Hex color code for the main button (default: #25d366)
- **buttonSize**: Size in pixels for the main button (default: 60)
- **position**: Widget placement - "left" or "right" (default: "right")
- **customIcon**: Custom icon URL for the main button

#### Messaging
- **tooltip**: Text displayed when hovering over the main button
- **tooltipDisplay**: When to show the tooltip - "hover", "always", or "never"
- **tooltipPosition**: Where to position the tooltip - "top", "bottom", "left", or "right"
- **greetingMessage**: Custom message displayed at the top of expanded channels

#### Channels
Configure communication channels in your dashboard with these supported types:
- WhatsApp
- Email
- Instagram
- Telegram
- Phone
- Facebook
- Twitter
- LinkedIn
- Custom URL

### 3. Mobile Optimization

The widget automatically adapts to mobile devices with these adjustments:
- Positioned at bottom right corner
- Tooltips repositioned to avoid screen edges
- Touch-friendly button sizes
- Simplified animations for better performance

### 4. Performance Considerations

For optimal performance:
- The widget loads asynchronously and won't block page rendering
- Total size is under 15KB minified
- No external dependencies required
- SVG icons are embedded to reduce HTTP requests
- Animations are optimized for 60fps on modern devices

### 5. Accessibility Features

The widget includes these accessibility enhancements:
- High contrast colors for text elements
- Keyboard navigation support
- ARIA labels for screen readers
- Respects user's reduced motion preferences

## Technical Details

### DOM Structure
The widget creates a self-contained DOM structure that includes:
- Main container with proper z-index
- Main button element
- Channel buttons container
- Individual channel buttons
- Tooltip elements

### Event Handling
The widget uses event delegation for efficient handling of:
- Click events for opening/closing
- Hover events for tooltips
- Touch events for mobile interaction

### CSS Methodology
The CSS uses a namespaced approach to prevent conflicts:
- All classes prefixed with `minimalist-`
- Scoped styles to avoid affecting page elements
- CSS variables for easy theming
- Mobile-first responsive design

## Troubleshooting

### Common Issues
- **Widget not appearing**: Check if the script is properly loaded and widget ID is correct
- **Channels not working**: Verify channel URLs and formatting in dashboard
- **Style conflicts**: Check for z-index conflicts with other fixed elements
- **Mobile display issues**: Ensure viewport meta tag is properly set

### Support Resources
For additional assistance, refer to:
- Documentation: https://hiclient.co/docs
- Support: support@hiclient.co