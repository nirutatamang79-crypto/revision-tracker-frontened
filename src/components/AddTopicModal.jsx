import { useState } from 'react';

export default function AddTopicModal({ onClose, onAdd }) {
  const [title, setTitle]       = useState('');
  const [question, setQuestion] = useState('');
  const [notes, setNotes]       = useState('');
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required.'); return; }
    setLoading(true); setError('');
    try {
      const tags = tagInput.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
      await onAdd({ title: title.trim(), question: question.trim() || null, notes: notes.trim() || null, tags });
      onClose();
    } catch (err) { setError(err.message); setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-paper border border-border p-6 fade-up">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl text-warm">New Topic</h2>
            <p className="font-mono text-xs text-muted mt-1">First revision due in 1 day</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-warm text-xl leading-none mt-1">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Topic title *', val: title, set: setTitle, ph: 'e.g. Krebs cycle…', required: true },
            { label: 'Recall question (optional)', val: question, set: setQuestion, ph: 'e.g. What are the 8 steps?' },
          ].map(f => (
            <div key={f.label}>
              <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-1.5">{f.label}</label>
              <input type="text" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                className="w-full bg-card border border-border text-warm font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-amber/60 placeholder:text-muted/40 transition-colors" />
            </div>
          ))}

          <div>
            <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-1.5">Notes (optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Key points to remember…"
              className="w-full bg-card border border-border text-warm font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-amber/60 placeholder:text-muted/40 transition-colors resize-none" />
          </div>

          <div>
            <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-1.5">Tags (comma-separated)</label>
            <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="bio, anatomy, chapter-3"
              className="w-full bg-card border border-border text-warm font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-amber/60 placeholder:text-muted/40 transition-colors" />
          </div>

          {error && <p className="font-mono text-xs text-ember">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Adding…' : 'Add topic →'}
            </button>
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

That's every file. Here's the folder structure to create in each GitHub repo:

**Backend** (4 files, all in root):
`package.json` · `db.js` · `index.js` · `.env.example`

**Frontend** (9 files across folders):
```
index.html
package.json
vite.config.js
tailwind.config.js
postcss.config.js
src/index.css
src/main.jsx
src/api.js
src/App.jsx
src/components/LiveClock.jsx
src/components/TopicCard.jsx
src/components/AddTopicModal.jsx
