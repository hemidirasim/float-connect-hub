# Minimalist Widget Template Specification

## 1. Widget Name and Purpose
- **Name**: Minimalist Contact Widget
- **Purpose**: Provides a clean, distraction-free way for website visitors to connect through various communication channels with minimal visual interference with the main website content.

## 2. Technical Requirements

### Dimensions
- **Main Button**: 60px × 60px (configurable via buttonSize parameter)
- **Channel Buttons**: 60px × 60px
- **Instagram Button**: 120px × 60px (special rectangular variant)
- **Responsive Behavior**: Automatically adjusts positioning on mobile devices

### Supported Platforms/Browsers
- **Desktop**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile**: iOS Safari, Android Chrome (latest 2 versions)
- **Minimum Screen Size**: 320px width

### Dependencies
- No external dependencies required
- Self-contained JavaScript, CSS, and HTML
- SVG icons embedded directly in the code

### Performance Targets
- **Total Size**: < 15KB (minified)
- **Load Time**: < 200ms
- **Animation Performance**: 60fps on modern devices
- **Memory Usage**: < 5MB

## 3. Design Elements

### Color Scheme
- **Main Button**: Customizable (default: #25d366)
- **WhatsApp**: #4ade80
- **Email**: #dc2626
- **Instagram**: #e4405f
- **Chatbot**: #8b5cf6
- **Close Button**: #e11d48
- **Tooltip Background**: rgba(0, 0, 0, 0.8)
- **Tooltip Text**: #ffffff

### Typography
- **Font Family**: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif
- **Button Text**: 16px, bold
- **Tooltip Text**: 14px, regular
- **Channel Name**: 14px, medium

### Layout Structure
- **Position**: Fixed to bottom right or bottom left of viewport
- **Stacking**: Vertical arrangement of channel buttons
- **Z-index**: 9999-10003 (ensuring visibility above other elements)
- **Spacing**: 12px between channel buttons

### Interactive Elements
- **Main Button**: Opens/closes the channel list
- **Channel Buttons**: Direct links to respective communication platforms
- **Close Button**: Explicitly closes the channel list
- **Tooltips**: Appear on hover for each button

### Responsive Behavior
- **Desktop**: Full functionality with hover effects
- **Tablet**: Optimized button sizes and spacing
- **Mobile**: Always positioned at bottom right, tooltips positioned to avoid screen edges

## 4. Content Components

### Main Button
- Circular button with customizable color
- Contains either a message icon or custom uploaded icon
- Displays tooltip on hover (configurable)

### Channel Buttons
- Circular buttons with platform-specific colors
- Contains platform icons
- Special rectangular variant for Instagram
- Displays channel name on hover

### Tooltips
- Appear on hover for each button
- Contains channel name or custom message
- Positioned based on widget placement (left/right)

### Close Button
- Appears as the last button in the channel list
- Red color with X icon
- Closes the channel list when clicked

## 5. Functionality

### Interactive Features
- **Button Click**: Opens/closes the channel list with animation
- **Channel Selection**: Opens the respective communication platform in a new tab
- **Hover Effects**: Shows tooltips and applies subtle scaling
- **Close Functionality**: Via dedicated close button or clicking outside

### User Interactions
- **Main Button Click**: Toggles channel list visibility
- **Channel Button Click**: Opens communication platform
- **Close Button Click**: Hides channel list
- **Outside Click**: Automatically closes channel list
- **Hover**: Shows tooltips and applies visual feedback

### Animations and Transitions
- **Channel List Open**: Staggered fade-in and slide-up (300ms)
- **Channel List Close**: Fade-out and slide-down (200ms)
- **Button Hover**: Scale up to 110% (300ms ease)
- **Button Active**: Scale down to 95% (150ms ease)
- **Close Button**: 45° rotation when menu is open

### Error Handling
- Graceful fallback if channel data is missing
- Default icons if custom icons fail to load
- Automatic positioning adjustment if near viewport edges
- Console logging for debugging purposes

## Accessibility Requirements
- **Color Contrast**: Minimum 4.5:1 ratio for text elements
- **Focus Indicators**: Visible focus states for keyboard navigation
- **Screen Reader Support**: Appropriate ARIA labels for all interactive elements
- **Keyboard Navigation**: Full functionality without mouse interaction
- **Reduced Motion**: Respects user's prefers-reduced-motion setting

## Brand Guidelines
- Maintains consistent visual language with the main website
- Allows for customization of primary colors to match brand identity
- Provides option for custom icon upload
- Supports custom messaging to match brand voice