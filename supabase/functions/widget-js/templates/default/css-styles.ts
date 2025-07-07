export const defaultCssStyles = `
  #lovable-widget-button {
    border-radius: 50%;
    background-color: {{BUTTON_COLOR}};
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: box-shadow 0.3s ease, background 0.3s ease;
    color: white;
    {{BUTTON_OFFSET_STYLE}}
  }
  
  #lovable-widget-button:hover {
    box-shadow: 0 12px 35px rgba(34, 197, 94, 0.5);
    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  }
  
  .live-chat-section {
    margin: 16px 0;
    padding: 16px 0;
    border-top: 1px solid #e5e7eb;
  }
  
  .live-chat-button {
    width: 100%;
    padding: 12px 16px;
    background: {{LIVE_CHAT_COLOR}};
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  .live-chat-button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  #lovable-livechat-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 100001;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
  }
  
  #lovable-livechat-content {
    background: white;
    border-radius: 16px;
    width: 90%;
    max-width: 420px;
    height: 600px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }
  
  #lovable-livechat-header {
    padding: 20px;
    background: {{LIVE_CHAT_COLOR}};
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  #lovable-livechat-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
  
  #lovable-livechat-close {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
  }
  
  #lovable-livechat-messages {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .chat-message {
    max-width: 80%;
  }
  
  .agent-message {
    align-self: flex-start;
  }
  
  .user-message {
    align-self: flex-end;
  }
  
  .message-content {
    padding: 8px 12px;
    border-radius: 12px;
    font-size: 14px;
  }
  
  .agent-message .message-content {
    background: #f3f4f6;
    color: #374151;
  }
  
  .user-message .message-content {
    background: {{LIVE_CHAT_COLOR}};
    color: white;
  }
  
  #lovable-livechat-input-area {
    padding: 16px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    gap: 8px;
  }
  
  #lovable-livechat-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 20px;
    outline: none;
  }
  
  #lovable-livechat-send {
    padding: 8px 16px;
    background: {{LIVE_CHAT_COLOR}};
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
  }
  
  #lovable-widget-tooltip {
    position: absolute;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 14px;
    white-space: nowrap;
    z-index: 100000;
    transition: all 0.2s ease;
    pointer-events: none;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    {{TOOLTIP_POSITION_STYLE}}
  }
  
  #lovable-widget-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 100000;
    display: flex;
    {{MODAL_ALIGNMENT}}
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }
  
  #lovable-modal-content {
    background: white;
    border-radius: 20px;
    padding: 0;
    max-width: 400px;
    width: 90%;
    max-height: 80vh;
    overflow: hidden;
    position: relative;
    transition: transform 0.3s ease;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    {{MODAL_CONTENT_POSITION}}
  }
  
  #lovable-modal-header {
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    color: white;
    padding: 20px;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    white-space: pre-line;
    line-height: 1.5;
  }
  
  #lovable-widget-close {
    position: absolute;
    top: 15px;
    right: 20px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease;
  }
  
  #lovable-widget-close:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  #lovable-widget-channels {
    padding: 20px;
    max-height: 50vh;
    overflow-y: auto;
  }
  
  .channel-item, .parent-channel {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    margin-bottom: 8px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    text-decoration: none;
    color: #334155;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
  }
  
  .channel-item:hover {
    background: #e2e8f0;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #cbd5e1;
  }
  
  .channel-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    background: #22c55e;
    color: white;
    flex-shrink: 0;
  }
  
  .channel-info {
    flex: 1;
    min-width: 0;
  }
  
  .channel-label {
    font-weight: 600;
    font-size: 16px;
    color: #1e293b;
    margin-bottom: 4px;
  }
  
  .channel-value {
    font-size: 14px;
    color: #64748b;
    word-break: break-all;
  }
  
  .channel-arrow {
    color: #22c55e;
    font-size: 18px;
    font-weight: bold;
    flex-shrink: 0;
  }
  
  .parent-channel-wrapper {
    position: relative;
    margin-bottom: 8px;
  }
  
  .dropdown-toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: background 0.2s ease;
  }
  
  .dropdown-toggle:hover {
    background: rgba(34, 197, 94, 0.1);
  }
  
  .dropdown-arrow {
    width: 20px;
    height: 20px;
    color: #22c55e;
    transition: transform 0.3s ease;
  }
  
  .dropdown-arrow.rotated {
    transform: rotate(180deg);
  }
  
  .child-count {
    background: #22c55e;
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
  }
  
  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    max-height: 300px;
    overflow-y: auto;
  }
  
  .dropdown.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  
  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    text-decoration: none;
    color: #334155;
    transition: background 0.2s ease;
    border-bottom: 1px solid #f1f5f9;
  }
  
  .dropdown-item:last-child {
    border-bottom: none;
  }
  
  .dropdown-item:hover {
    background: #f8fafc;
  }
  
  .dropdown-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    background: #22c55e;
    color: white;
    flex-shrink: 0;
  }
  
  .dropdown-info {
    flex: 1;
    min-width: 0;
  }
  
  .dropdown-label {
    font-weight: 500;
    font-size: 14px;
    color: #1e293b;
    margin-bottom: 2px;
  }
  
  .dropdown-value {
    font-size: 12px;
    color: #64748b;
    word-break: break-all;
  }
  
  .lovable-empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #64748b;
  }
  
  .lovable-empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .hiclient-video-player {
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
    border-radius: 12px;
    margin-bottom: 20px;
  }
  
  .hiclient-video-container {
    width: 100%;
    margin-bottom: 20px;
    border-radius: 12px;
    overflow: hidden;
    background: #000;
    position: relative;
    z-index: 1;
  }
  
  .hiclient-video-container iframe {
    width: 100% !important;
    height: 200px !important;
    border: none;
    border-radius: 12px;
  }
  
  @media (max-width: 768px) {
    #lovable-modal-content {
      width: 95%;
      max-height: 85vh;
    }
    
    .channel-item, .parent-channel {
      padding: 12px;
      gap: 10px;
    }
    
    .channel-icon {
      width: 40px;
      height: 40px;
      font-size: 20px;
    }
    
    .channel-label {
      font-size: 14px;
    }
    
    .channel-value {
      font-size: 12px;
    }
    
    .dropdown-icon {
      width: 32px;
      height: 32px;
      font-size: 16px;
    }
    
    #lovable-modal-header {
      padding: 16px;
      font-size: 16px;
    }
    
    #lovable-widget-channels {
      padding: 16px;
    }
  }
`;