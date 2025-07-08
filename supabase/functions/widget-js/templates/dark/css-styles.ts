export const darkCssStyles = `
/* Dark Theme CSS */
.hiclient-widget-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.hiclient-widget-button {
  width: {{BUTTON_SIZE}}px;
  height: {{BUTTON_SIZE}}px;
  border-radius: 50%;
  background: {{BUTTON_COLOR}};
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.hiclient-widget-button:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35);
}

.hiclient-tooltip {
  position: absolute;
  background: rgba(20, 20, 20, 0.95);
  color: white;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  white-space: nowrap;
  z-index: 100000;
  transition: all 0.2s ease;
  pointer-events: none;
  backdrop-filter: blur(10px);
}

.hiclient-tooltip.show {
  opacity: 1;
  visibility: visible;
}

.hiclient-tooltip.hide {
  opacity: 0;
  visibility: hidden;
}

.hiclient-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 100000;
  display: none;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.hiclient-modal-backdrop.show {
  opacity: 1;
  visibility: visible;
  display: flex;
}

.hiclient-modal-content {
  background: #1a1a1a;
  color: white;
  padding: 28px;
  border-radius: 16px;
  max-width: 28rem;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  transform: scale(0.9) translateY(20px);
  transition: transform 0.3s ease;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  position: relative;
  border: 1px solid #333;
}

.hiclient-modal-backdrop.show .hiclient-modal-content {
  transform: scale(1) translateY(0);
}

.hiclient-modal-close {
  position: absolute;
  top: 16px;
  right: 20px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
  color: #888;
  border-radius: 50%;
  transition: all 0.2s ease;
  font-weight: 300;
}

.hiclient-modal-close:hover {
  background: #333;
  color: #fff;
}

.hiclient-modal-header {
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  text-align: center;
  line-height: 1.4;
  padding-right: 40px;
}

.hiclient-video-container {
  margin-bottom: 24px;
}

.hiclient-video-player {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 20px;
  object-fit: cover;
}

.hiclient-channels-container {
  max-height: 300px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.hiclient-channel-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #333;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  background: #222;
}

.hiclient-channel-item:hover {
  background-color: #2a2a2a;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: #444;
}

.hiclient-channel-icon {
  width: 44px;
  height: 44px;
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
  font-weight: 600;
  font-size: 15px;
  color: #fff;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.hiclient-channel-value {
  font-size: 13px;
  color: #aaa;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  line-height: 1.3;
}

.hiclient-external-icon {
  width: 18px;
  height: 18px;
  color: #666;
  flex-shrink: 0;
}

.hiclient-empty-state {
  text-align: center;
  padding: 50px 20px;
  color: #888;
}

.hiclient-empty-icon {
  width: 40px;
  height: 40px;
  margin: 0 auto 16px;
  opacity: 0.4;
}

/* Channel group styles */
.hiclient-channel-group {
  position: relative;
  margin-bottom: 12px;
}

.hiclient-group-trigger {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #333;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #222;
  position: relative;
}

.hiclient-group-trigger:hover {
  background-color: #2a2a2a;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: #444;
}

.hiclient-group-dropdown {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  background: #1a1a1a;
  border-radius: 8px;
  margin-top: 8px;
  border: 1px solid #333;
}

.hiclient-group-dropdown.show {
  max-height: 300px;
}

.hiclient-group-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  text-decoration: none;
  color: #fff;
  transition: all 0.2s ease;
  border-bottom: 1px solid #333;
}

.hiclient-group-item:last-child {
  border-bottom: none;
}

.hiclient-group-item:hover {
  background: #2a2a2a;
}

.hiclient-group-item-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hiclient-group-item-info {
  flex: 1;
  min-width: 0;
}

.hiclient-group-item-label {
  font-weight: 500;
  font-size: 14px;
  color: #fff;
  margin: 0 0 2px 0;
  line-height: 1.2;
}

.hiclient-group-item-value {
  font-size: 12px;
  color: #aaa;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  line-height: 1.2;
}

.hiclient-group-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #444;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  line-height: 1.2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}`;
