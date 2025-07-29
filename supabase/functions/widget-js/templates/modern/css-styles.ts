
export function getModernCssStyles(): string {
  return `
/* Modern Template CSS */
.hiclient-widget-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  user-select: none;
}

/* Main Button */
.hiclient-widget-button {
  width: {{BUTTON_SIZE}}px;
  height: {{BUTTON_SIZE}}px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
  cursor: pointer;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.4);
  border: 3px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.hiclient-button-inner {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  transition: all 0.3s ease;
}

.hiclient-widget-button:hover {
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.6);
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.hiclient-widget-button:active {
  transform: scale(0.95);
}

/* Tooltip */
.hiclient-tooltip {
  position: absolute;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  color: white;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 100001;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.hiclient-tooltip::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  transform: rotate(45deg);
}

.hiclient-tooltip.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(-2px);
}

.hiclient-tooltip.hide {
  opacity: 0;
  visibility: hidden;
  transform: translateY(2px);
}

/* Modal */
.hiclient-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hiclient-modal-backdrop.show {
  opacity: 1;
  visibility: visible;
}

.hiclient-modal-content {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 24px;
  max-width: 420px;
  width: 90%;
  max-height: 85vh;
  overflow: hidden;
  transform: scale(0.8) translateY(40px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
}

.hiclient-modal-backdrop.show .hiclient-modal-content {
  transform: scale(1) translateY(0);
}

.hiclient-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 32px 16px 32px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
}

.hiclient-modal-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hiclient-modal-close {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.2);
  cursor: pointer;
  color: #666;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.hiclient-modal-close:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  transform: scale(1.05);
}

.hiclient-video-container {
  margin: 24px 32px;
}

.hiclient-video-player {
  width: 100%;
  border-radius: 16px;
  object-fit: cover;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.hiclient-channels-list {
  padding: 0 32px 32px 32px;
  max-height: 400px;
  overflow-y: auto;
}

/* Individual Channel Item - Clean Layout */
.hiclient-channel-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(102, 126, 234, 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  color: inherit;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: visible;
}

.hiclient-channel-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 14px;
}

.hiclient-channel-item:last-child {
  margin-bottom: 0;
}

.hiclient-channel-item:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(102, 126, 234, 0.3);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
}

.hiclient-channel-item:hover::before {
  opacity: 1;
}

.hiclient-channel-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 24px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.hiclient-channel-item:hover .hiclient-channel-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 6px 24px rgba(102, 126, 234, 0.4);
}

.hiclient-channel-info {
  flex: 1;
  min-width: 0;
}

.hiclient-channel-label {
  font-weight: 700;
  font-size: 16px;
  color: #1a1a1a;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.hiclient-channel-value {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hiclient-external-icon {
  width: 20px;
  height: 20px;
  color: #999;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hiclient-channel-item:hover .hiclient-external-icon {
  color: #667eea;
  transform: translateX(4px) rotate(15deg);
}

/* Group Channel with Hover Dropdown */
.hiclient-channel-group {
  position: relative;
  margin-bottom: 12px;
}

.hiclient-group-trigger {
  position: relative;
}

.hiclient-group-trigger .hiclient-channel-value::after {
  content: '';
  position: absolute;
  right: 20px;
  top: 50%;
  width: 8px;
  height: 8px;
  border: 2px solid #667eea;
  border-left: none;
  border-bottom: none;
  transform: translateY(-50%) rotate(45deg);
  transition: transform 0.3s ease;
}

/* Hover Dropdown for Sub-channels */
.hiclient-group-dropdown {
  position: absolute;
  left: -280px;
  top: 0;
  width: 260px;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
  backdrop-filter: blur(20px);
  opacity: 0;
  visibility: hidden;
  transform: translateX(20px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  padding: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.hiclient-channel-group:hover .hiclient-group-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
}

/* Sub-channel Items in Dropdown */
.hiclient-group-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  font-size: 14px;
}

.hiclient-group-item:last-child {
  margin-bottom: 0;
}

.hiclient-group-item:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(102, 126, 234, 0.3);
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
}

.hiclient-group-item-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: white;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.hiclient-group-item:hover .hiclient-group-item-icon {
  transform: scale(1.1);
}

.hiclient-group-item-info {
  flex: 1;
  min-width: 0;
}

.hiclient-group-item-label {
  font-weight: 600;
  font-size: 14px;
  color: #1a1a1a;
  margin: 0 0 2px 0;
  line-height: 1.2;
}

.hiclient-group-item-value {
  font-size: 12px;
  color: #666;
  margin: 0;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hiclient-empty-state {
  text-align: center;
  padding: 80px 32px;
  color: #999;
}

.hiclient-empty-state svg {
  margin-bottom: 20px;
  opacity: 0.6;
}

.hiclient-empty-state p {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

/* Scrollbar styling */
.hiclient-channels-list::-webkit-scrollbar,
.hiclient-group-dropdown::-webkit-scrollbar {
  width: 6px;
}

.hiclient-channels-list::-webkit-scrollbar-track,
.hiclient-group-dropdown::-webkit-scrollbar-track {
  background: rgba(102, 126, 234, 0.1);
  border-radius: 3px;
}

.hiclient-channels-list::-webkit-scrollbar-thumb,
.hiclient-group-dropdown::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
}

.hiclient-channels-list::-webkit-scrollbar-thumb:hover,
.hiclient-group-dropdown::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}`;
}
