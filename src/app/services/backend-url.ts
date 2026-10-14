declare global {
  interface Window {
    CHATTER_CONFIG?: {
      backendUrl?: string;
    };
  }
}

const configuredBackendUrl = window.CHATTER_CONFIG && window.CHATTER_CONFIG.backendUrl;

export const BACKEND_URL = configuredBackendUrl || 'http://' + window.location.hostname + ':3000';
