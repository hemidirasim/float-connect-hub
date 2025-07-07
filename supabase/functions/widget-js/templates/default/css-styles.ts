export const defaultCssStyles = `
  /* Modern Button Design */
  #lovable-widget-button {
    border-radius: 50%;
    background: linear-gradient(135deg, {{BUTTON_COLOR}}, #16a34a);
    border: none;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    color: white;
    box-shadow: 0 8px 32px rgba(34, 197, 94, 0.3);
    overflow: hidden;
    {{BUTTON_OFFSET_STYLE}}
  }
  
  .button-content {
    position: relative;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
  }
  
  #lovable-widget-button:hover .button-content {
    transform: scale(1.1);
  }
  
  .pulse-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border: 3px solid rgba(34, 197, 94, 0.3);
    border-radius: 50%;
    animation: pulse-ring 2s infinite ease-out;
  }
  
  .pulse-ring-2 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border: 3px solid rgba(34, 197, 94, 0.2);
    border-radius: 50%;
    animation: pulse-ring 2s infinite ease-out 1s;
  }
  
  @keyframes pulse-ring {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(2);
      opacity: 0;
    }
  }
  
  #lovable-widget-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 48px rgba(34, 197, 94, 0.4);
  }
  
  #lovable-widget-button:active {
    transform: translateY(-1px);
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
  
  .system-message {
    text-align: center;
    font-style: italic;
    opacity: 0.7;
    margin: 16px 0;
  }
  
  .system-message .message-content {
    background: #f3f4f6;
    border-radius: 8px;
    padding: 8px 12px;
    color: #6b7280;
    font-size: 14px;
    display: inline-block;
    border: none;
    box-shadow: none;
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
    padding: 12px;
    background: linear-gradient(135deg, {{LIVE_CHAT_COLOR}} 0%, #6366f1 100%);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
    letter-spacing: -0.01em;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  #lovable-livechat-send:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  }
  
  #lovable-livechat-send:active {
    transform: scale(0.95);
  }

  /* Modern Modal Design */
  #lovable-widget-tooltip {
    position: absolute;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(12px);
    color: white;
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 14px;
    white-space: nowrap;
    z-index: 100000;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-weight: 500;
    letter-spacing: -0.01em;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    {{TOOLTIP_POSITION_STYLE}}
  }
  
  #lovable-widget-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100000;
    display: flex;
    {{MODAL_ALIGNMENT}}
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  #lovable-modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    animation: backdropFadeIn 0.4s ease-out;
  }
  
  @keyframes backdropFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  #lovable-modal-content {
    background: white;
    border-radius: 24px;
    padding: 0;
    max-width: 420px;
    width: 90%;
    max-height: 85vh;
    overflow: hidden;
    position: relative;
    z-index: 1;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 32px 64px rgba(0, 0, 0, 0.2);
    {{MODAL_CONTENT_POSITION}}
  }
  
  #lovable-modal-header {
    position: relative;
    overflow: hidden;
    border-radius: 24px 24px 0 0;
  }
  
  .header-gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%);
    opacity: 1;
  }
  
  .header-content {
    position: relative;
    padding: 28px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 2;
  }
  
  .greeting-text {
    color: white;
    font-size: 20px;
    font-weight: 700;
    white-space: pre-line;
    line-height: 1.4;
    letter-spacing: -0.02em;
    flex: 1;
  }
  
  #lovable-widget-close {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    flex-shrink: 0;
    margin-left: 16px;
  }
  
  #lovable-widget-close:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
  }
  
  .modal-body {
    padding: 0;
  }

  /* Modern Channels Container */
  .channels-container {
    padding: 24px;
    background: #fafbfc;
  }
  
  #lovable-widget-channels {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  /* Enhanced Channel Item */
  .channel-item {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-radius: 16px;
    background: white;
    border: 2px solid #f1f5f9;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-decoration: none;
    color: inherit;
    position: relative;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
  
  .channel-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.6s ease;
  }
  
  .channel-item:hover::before {
    left: 100%;
  }
  
  .channel-item:hover {
    transform: translateY(-2px);
    border-color: #e2e8f0;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
  
  .channel-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    position: relative;
    z-index: 1;
    flex-shrink: 0;
  }
  
  .channel-info {
    flex: 1;
    position: relative;
    z-index: 1;
  }
  
  .channel-label {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 4px;
    letter-spacing: -0.01em;
  }
  
  .channel-value {
    font-size: 14px;
    color: #64748b;
    font-weight: 400;
  }
  
  .channel-arrow {
    color: #94a3b8;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
  }
  
  .channel-item:hover .channel-arrow {
    color: #475569;
    transform: translateX(4px);
  }
  
  /* Modern Empty State */
  .lovable-empty-state {
    text-align: center;
    padding: 48px 24px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }
  
  .empty-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 20px;
    background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
  }
  
  .lovable-empty-state h3 {
    font-size: 18px;
    font-weight: 600;
    color: #334155;
    margin: 0 0 8px 0;
    letter-spacing: -0.01em;
  }
  
  .lovable-empty-state p {
    font-size: 14px;
    color: #64748b;
    margin: 0;
    line-height: 1.5;
  }

  /* Video content styling */
  .video-content {
    margin: 0 24px 24px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
  
  .video-content video {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 16px;
  }

  /* Channel groups and dropdowns - Fixed Design */
  .lovable-channel-group {
    position: relative;
    margin-bottom: 12px;
  }
  
  .lovable-group-trigger {
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
  }
  
  .lovable-group-trigger:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }
  
  .lovable-group-trigger::after {
    content: '';
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%) rotate(0deg);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid #94a3b8;
    transition: transform 0.3s ease;
  }
  
  .lovable-group-trigger.open::after {
    transform: translateY(-50%) rotate(180deg);
  }
  
  .dropdown {
    display: none;
    margin-top: 8px;
    margin-left: 20px;
    padding: 12px 0;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
  }
  
  .dropdown.open {
    display: block;
    opacity: 1;
    transform: translateY(0);
  }
  
  .lovable-group-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s ease;
    border-left: 3px solid transparent;
  }
  
  .lovable-group-item:hover {
    background: #f8fafc;
    border-left-color: #4f46e5;
    transform: translateX(4px);
  }
  
  .lovable-group-item-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    flex-shrink: 0;
  }
  
  .lovable-group-item-info {
    flex: 1;
  }
  
  .lovable-group-item-label {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 2px;
  }
  
  .lovable-group-item-value {
    font-size: 12px;
    color: #64748b;
  }
  
  .group-toggle, .dropdown-toggle {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: color 0.2s ease;
  }
  
  .group-toggle:hover, .dropdown-toggle:hover {
    color: #475569;
  }
  
  .toggle-icon {
    transition: transform 0.2s ease;
  }
  
  .toggle-icon.open {
    transform: rotate(90deg);
  }

  /* Responsive design */
  @media (max-width: 480px) {
    #lovable-modal-content {
      width: 95%;
      max-height: 90vh;
      border-radius: 20px;
    }
    
    .header-content {
      padding: 24px 20px;
    }
    
    .greeting-text {
      font-size: 18px;
    }
    
    .channels-container {
      padding: 20px;
    }
    
    .channel-item {
      padding: 14px 16px;
    }
    
    .channel-icon {
      width: 44px;
      height: 44px;
    }
    
    .channel-label {
      font-size: 15px;
    }
    
    .channel-value {
      font-size: 13px;
    }
  }
`;