'use client';

export function PrintButton() {
  return (
    <button onClick={() => window.print()}
      style={{ marginLeft: 'auto', border: 0, background: 'var(--kraft)', color: 'var(--ink)', fontWeight: 800, fontSize: 12.5, borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}>
      🖨 Хэвлэх
    </button>
  );
}
