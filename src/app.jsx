import { useState, useEffect, useCallback } from 'react';
import { DateTime } from 'luxon';
import { api } from './api';
import LiveClock from './components/LiveClock';
import TopicCard from './components/TopicCard';
import AddTopicModal from './components/AddTopicModal';

const NPT = 'Asia/Kathmandu';

function isItemDue(item) {
  if (item.stage >= 3 || !item.next_due_at) return false;
  const now = DateTime.now().setZone(NPT);
  const due = DateTime.fromISO(item.next_due_at).setZone(NPT);
  return due.startOf('day') <= now.startOf('day');
}

export default function App() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [showAdd, setShowAdd]   = useState(false);
  const [filter, setFilter]     = useState('all');
  const [toastMsg, setToastMsg] = useState('');

  const toast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 2500); };

  const loadItems = useCallback(async () => {
    try {
      const data = await api.getItems();
      setItems(data);
    } catch (e) {
      setError('Could not reach the backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);

  async function handleRevise(id) {
    try {
      const updated = await api.reviseItem(id);
      setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
      toast(updated.stage >= 3 ? '🎉 Mastered!' : `✓ Revised! Next: +${[1,4,7][updated.stage-1]}d`);
    } catch (e) { toast('Error: ' + e.message); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this topic?')) return;
    try {
      await api.deleteItem(id);
      setItems(prev => prev.filter(i => i.id !== id));
      toast('Deleted.');
    } catch (e) { toast('Error: ' + e.message); }
  }

  async function handleAdd(body) {
    const created = await api.createItem(body);
    setItems(prev => [created, ...prev]);
    toast('Topic added!');
  }

  const dueItems      = items.filter(isItemDue);
  const upcomingItems = items.filter(i => i.stage < 3 && !isItemDue(i));
  const masteredItems = items.filter(i => i.stage >= 3);

  const filterMap = { all: [...dueItems, ...upcomingItems, ...masteredItems], due: dueItems, mastered: masteredItems };
  const visibleItems = filterMap[filter] || [];

  const FILTERS = [
    { key: 'all', label: 'All', count: items.length },
    { key: 'due', label: 'Due', count: dueItems.length },
    { key: 'mastered', label: 'Mastered', count: masteredItems.length },
  ];

  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-border sticky top-0 z-10 bg-ink/90 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl text-warm leading-none">
              1·4·7 <span className="italic font-normal text-amber">Revise</span>
            </h1>
            <div className="mt-1"><LiveClock /></div>
          </div>
          <button onClick={() => setShowAdd(true)} className="btn-primary whitespace-nowrap mt-0.5">
            + New topic
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 pt-5">
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Due today',   value: dueItems.length,      color: dueItems.length ? 'text-amber' : 'text-muted' },
            { label: 'In progress', value: upcomingItems.length,  color: 'text-warm' },
            { label: 'Mastered',    value: masteredItems.length,  color: 'text-sage' },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border p-3 text-center">
              <div className={`font-display text-3xl ${s.color}`}>{s.value}</div>
              <div className="font-mono text-xs text-muted mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-1 mb-5 border-b border-border pb-0">
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`font-mono text-xs px-3 py-2 border-b-2 -mb-px transition-colors ${
                filter === f.key ? 'border-amber text-amber' : 'border-transparent text-muted hover:text-warm'
              }`}>
              {f.label}
              {f.count > 0 && <span className="ml-1.5 text-[10px]">{f.count}</span>}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 pb-20">
        {loading && <div className="font-mono text-sm text-muted text-center py-20">Loading…</div>}
        {error   && <div className="font-mono text-xs text-ember border border-ember/30 p-4 text-center">{error}</div>}

        {!loading && !error && visibleItems.length === 0 && (
          <div className="text-center py-20">
            <div className="font-display text-5xl text-border mb-4">∅</div>
            <p className="font-mono text-sm text-muted">
              {filter === 'due' ? "Nothing due — you're on top of it." : 'No topics yet. Add one above.'}
            </p>
          </div>
        )}

        {filter === 'all' && dueItems.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs uppercase tracking-widest text-amber">Due today</span>
              <div className="flex-1 border-t border-amber/20" />
            </div>
            <div className="space-y-3">
              {dueItems.map((item, i) => <TopicCard key={item.id} item={item} onRevise={handleRevise} onDelete={handleDelete} style={{ animationDelay: `${i*40}ms` }} />)}
            </div>
          </div>
        )}

        {filter === 'all' && upcomingItems.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">Upcoming</span>
              <div className="flex-1 border-t border-border" />
            </div>
            <div className="space-y-3">
              {upcomingItems.map((item, i) => <TopicCard key={item.id} item={item} onRevise={handleRevise} onDelete={handleDelete} style={{ animationDelay: `${i*40}ms` }} />)}
            </div>
          </div>
        )}

        {filter !== 'all' && (
          <div className="space-y-3">
            {visibleItems.map((item, i) => <TopicCard key={item.id} item={item} onRevise={handleRevise} onDelete={handleDelete} style={{ animationDelay: `${i*40}ms` }} />)}
          </div>
        )}

        {filter === 'all' && masteredItems.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs uppercase tracking-widest text-sage">Mastered</span>
              <div className="flex-1 border-t border-border" />
              <span className="font-mono text-xs text-muted">{masteredItems.length}</span>
            </div>
            <div className="space-y-3">
              {masteredItems.map((item, i) => <TopicCard key={item.id} item={item} onRevise={handleRevise} onDelete={handleDelete} style={{ animationDelay: `${i*40}ms` }} />)}
            </div>
          </div>
        )}
      </main>

      {showAdd && <AddTopicModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}

      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-card border border-border font-mono text-xs text-warm px-4 py-2.5 shadow-lg fade-up">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
