const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function req(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  getItems:   ()         => req('/api/items'),
  createItem: (body)     => req('/api/items', { method: 'POST', body: JSON.stringify(body) }),
  reviseItem: (id)       => req(`/api/items/${id}/revise`, { method: 'POST' }),
  updateItem: (id, body) => req(`/api/items/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteItem: (id)       => req(`/api/items/${id}`, { method: 'DELETE' }),
};
