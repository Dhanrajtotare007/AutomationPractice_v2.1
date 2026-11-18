import { createElement, useEffect, useRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { ShadowReactWidgetProps } from './ShadowReactWidget';

/**
 * Mounts a React tree into an open shadow root.
 *
 * The shadow host is created imperatively (outside of React's own subtree) so
 * that StrictMode double-mounting can never call attachShadow twice.
 */
export function ShadowReactHost({ mount, widgetTestId }: { mount: (root: Root) => void; widgetTestId?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef(mount);
  mountRef.current = mount;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const host = document.createElement('div');
    host.setAttribute('data-testid', widgetTestId ?? 'shadow-react-host');
    const shadow = host.attachShadow({ mode: 'open' });
    container.appendChild(host);
    const root = createRoot(shadow);
    mountRef.current(root);
    return () => {
      container.removeChild(host);
      window.setTimeout(() => root.unmount(), 0);
    };
  }, [widgetTestId]);

  return createElement('div', { ref: containerRef });
}

export type { ShadowReactWidgetProps };
