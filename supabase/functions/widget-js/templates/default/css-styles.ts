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
  
  /* Live Chat Button Section */
  .live-chat-section {
    margin: 16px 20px 20px;
    padding: 20px;
    border-top: 1px solid #e2e8f0;
    background: linear-gradient(135deg, #fefefe 0%, #f8fafc 100%);
    z-index: 10;
  }
  
  .live-chat-button {
    width: 100%;
    background: linear-gradient(135deg, {{LIVE_CHAT_COLOR}} 0%, #6366f1 100%);
    color: white;
    border: none;
    padding: 18px 28px;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.25);
    letter-spacing: -0.025em;
    position: relative;
    overflow: hidden;
  }
  
  .live-chat-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  .live-chat-button:hover::before {
    left: 100%;
  }
  
  .live-chat-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4);
  }
  
  .live-chat-button:active {
    transform: translateY(-1px);
  }
  
  .live-chat-button svg {
    flex-shrink: 0;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  }

  /* Live Chat Content - Improved Design */
  #lovable-livechat-content {
    display: none;
    flex-direction: column;
    height: 100%;
    background: #ffffff;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 80px rgba(0, 0, 0, 0.15);
  }
  
  #lovable-livechat-header {
    background: linear-gradient(135deg, {{LIVE_CHAT_COLOR}} 0%, #6366f1 100%);
    color: white;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.2);
    position: relative;
  }
  
  #lovable-livechat-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%);
    pointer-events: none;
  }
  
  #lovable-livechat-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.01em;
    z-index: 1;
    position: relative;
  }
  
  .livechat-controls {
    display: flex;
    gap: 8px;
    align-items: center;
    z-index: 1;
    position: relative;
  }
  
  #lovable-livechat-back {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
  }
  
  #lovable-livechat-back:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-1px);
  }

  .end-chat-btn {
    background: rgba(239, 68, 68, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
  }

  .end-chat-btn:hover {
    background: rgba(220, 38, 38, 0.95);
    transform: translateY(-1px);
  }

  /* Pre-chat Form - Redesigned */
  #lovable-prechat-form {
    padding: 32px 28px;
    flex: 1;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #fafbfc 0%, #f1f5f9 100%);
    gap: 24px;
    justify-content: center;
    min-height: 0;
  }
  
  .prechat-title {
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 8px;
    text-align: center;
    line-height: 1.3;
  }
  
  .prechat-fields {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 100%;
    margin: 0;
  }
  
  .prechat-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .prechat-field label {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 4px;
  }
  
  .prechat-field input {
    padding: 14px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 15px;
    transition: all 0.2s ease;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    font-weight: 400;
  }
  
  .prechat-field input:focus {
    outline: none;
    border-color: {{LIVE_CHAT_COLOR}};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  
  .prechat-field input::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
  
  .prechat-submit-btn {
    padding: 16px 24px;
    background: linear-gradient(135deg, {{LIVE_CHAT_COLOR}} 0%, #6366f1 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 8px;
    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
    letter-spacing: -0.01em;
  }
  
  .prechat-submit-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
  }
  
  .prechat-submit-btn:active {
    transform: translateY(0);
  }

  /* Chat Messages - Modern Design */
  #lovable-livechat-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #fafbfc;
    min-height: 300px;
    max-height: 400px;
  }
  
  .chat-message {
    display: flex;
    margin-bottom: 8px;
    animation: slideInUp 0.3s ease-out;
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .agent-message {
    justify-content: flex-start;
  }
  
  .user-message {
    justify-content: flex-end;
  }
  
  .message-content {
    max-width: 80%;
    padding: 12px 16px;
    border-radius: 18px;
    font-size: 14px;
    line-height: 1.4;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    font-weight: 400;
    word-wrap: break-word;
    position: relative;
  }
  
  .agent-message .message-content {
    background: white;
    color: #374151;
    border-bottom-left-radius: 6px;
    border: 1px solid #e5e7eb;
    margin-right: 40px;
  }
  
  .agent-message .message-content::before {
    content: '';
    position: absolute;
    left: -6px;
    bottom: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 0 8px 8px;
    border-color: transparent transparent white transparent;
  }
  
  .user-message .message-content {
    background: linear-gradient(135deg, {{LIVE_CHAT_COLOR}} 0%, #6366f1 100%);
    color: white;
    border-bottom-right-radius: 6px;
    margin-left: 40px;
  }
  
  .user-message .message-content::before {
    content: '';
    position: absolute;
    right: -6px;
    bottom: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 8px 8px 0;
    border-color: transparent {{LIVE_CHAT_COLOR}} transparent transparent;
  }

  /* Chat Input - Improved */
  #lovable-livechat-input-area {
    padding: 16px 20px;
    border-top: 1px solid #e2e8f0;
    display: flex;
    gap: 12px;
    background: white;
    align-items: center;
  }
  
  #lovable-livechat-input {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 24px;
    outline: none;
    font-size: 14px;
    transition: all 0.2s ease;
    background: #f8fafc;
    font-weight: 400;
  }
  
  #lovable-livechat-input:focus {
    border-color: {{LIVE_CHAT_COLOR}};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    background: white;
  }
  
  #lovable-livechat-input::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
  
  #lovable-livechat-send {
    padding: 12px 20px;
    background: linear-gradient(135deg, {{LIVE_CHAT_COLOR}} 0%, #6366f1 100%);
    color: white;
    border: none;
    border-radius: 24px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
    letter-spacing: -0.01em;
    min-width: 60px;
  }
  
  #lovable-livechat-send:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  }
  
  #lovable-livechat-send:active {
    transform: translateY(0);
  }

  /* Main Modal */
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
    max-height: 200px !important;
    border-radius: 12px;
    margin-bottom: 20px;
    z-index: 1;
    position: relative;
    object-fit: contain !important;
  }
  
  .hiclient-video-container {
    width: 100%;
    max-width: 100%;
    max-height: 250px;
    margin-bottom: 20px;
    border-radius: 12px;
    overflow: hidden;
    background: #000;
    position: relative;
    z-index: 1;
  }
  
  .hiclient-video-container iframe {
    width: 100% !important;
    max-width: 100% !important;
    height: 200px !important;
    max-height: 200px !important;
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
    
    #lovable-modal-header {
      padding: 16px;
      font-size: 16px;
    }
    
    #lovable-widget-channels {
      padding: 16px;
    }
    
    #lovable-prechat-form {
      padding: 24px 20px;
    }
    
    .prechat-fields {
      max-width: 100%;
    }
    
    #lovable-livechat-input-area {
      padding: 20px;
      gap: 12px;
    }
    
    #lovable-livechat-messages {
      padding: 20px;
    }
  }
`;