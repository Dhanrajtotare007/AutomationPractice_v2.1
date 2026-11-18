import { useState } from 'react';

export interface ShadowReactWidgetProps {
  onEvent: (message: string) => void;
}

/** Counter rendered inside a shadow root - deliberately styled with inline CSS only. */
export function ShadowReactWidget({ onEvent }: ShadowReactWidgetProps) {
  const [count, setCount] = useState(0);

  return (
    <div
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: 14,
        background: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#1e293b',
      }}
    >
      <h3 data-testid="shadow-react-heading" style={{ margin: '0 0 4px', fontSize: 14 }}>
        React rendered inside a shadow root
      </h3>
      <p style={{ margin: '0 0 10px', fontSize: 12.5, color: '#64748b' }}>
        State lives in React but the DOM is fully encapsulated by the shadow boundary.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          type="button"
          data-testid="shadow-react-increment"
          onClick={() => {
            setCount((value) => value + 1);
            onEvent('React shadow counter incremented');
          }}
          style={{ padding: '6px 12px', borderRadius: 8, border: 0, background: '#8f1f3a', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
        >
          Increment
        </button>
        <span data-testid="shadow-react-count" style={{ fontSize: 13, fontWeight: 700, color: '#0891b2' }}>
          Count: {count}
        </span>
      </div>
    </div>
  );
}
