import { useEffect, useRef, useCallback } from 'react';

type EventHandler = (data: any) => void;

interface UseWebSocketOptions {
  onOpen?: () => void;
  onClose?: () => void;
  onError?: () => void;
}

/**
 * Low-level hook wrapping the native WebSocket API.
 * Handles auto-reconnect with exponential backoff.
 */
export function useWebSocket(url: string | null, options: UseWebSocketOptions = {}) {
  const wsRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Map<string, EventHandler[]>>(new Map());
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reconnectAttempts = useRef(0);
  const maxReconnects = 10;

  const emit = useCallback((type: string, data: any) => {
    const handlers = handlersRef.current.get(type) || [];
    handlers.forEach(h => h(data));
    // Also call wildcard handlers
    const wildcards = handlersRef.current.get('*') || [];
    wildcards.forEach(h => h(data));
  }, []);

  const connect = useCallback(() => {
    if (!url) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      reconnectAttempts.current = 0;
      options.onOpen?.();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        emit(data.type, data);
      } catch (e) {
        console.error('[WS] Failed to parse message', e);
      }
    };

    ws.onclose = () => {
      options.onClose?.();
      // Auto-reconnect with exponential backoff
      if (reconnectAttempts.current < maxReconnects) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
        reconnectAttempts.current++;
        reconnectTimer.current = setTimeout(() => connect(), delay);
      }
    };

    ws.onerror = () => {
      options.onError?.();
      ws.close();
    };
  }, [url, emit, options]);

  // On event handler registration
  const on = useCallback((type: string, handler: EventHandler) => {
    if (!handlersRef.current.has(type)) {
      handlersRef.current.set(type, []);
    }
    handlersRef.current.get(type)!.push(handler);

    // Return an off() function
    return () => {
      const handlers = handlersRef.current.get(type) || [];
      handlersRef.current.set(type, handlers.filter(h => h !== handler));
    };
  }, []);

  // Send JSON payload
  const send = useCallback((data: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    if (!url) return;
    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [url]);

  return { send, on };
}
