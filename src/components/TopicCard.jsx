import { DateTime } from 'luxon';

const NPT = 'Asia/Kathmandu';
const STAGE_LABELS = ['Day 1', 'Day 4', 'Day 7', 'Mastered'];
const STAGE_COLORS = ['bg-muted', 'bg-amber', 'bg-ember', 'bg-sage'];

function DueBadge({ item }) {
  if (item.stage >= 3) return <span className="font-mono text-xs text-sage px-2 py-0.5 border border-sage/30">✓ Mastered</span>;
  if (!item.next_due_at) return null;
  const now = DateTime.now().setZone(NPT);
  const due = DateTime.fromISO(item.next_due_at).setZone(NPT);
  const diff = due.startOf('day').diff(now.startOf('day'), 'days').days;
  if (diff < 0)  return <span className="font-mono text-xs text-ember px-2 py-0.5 border border-ember/40">Overdue {Math.abs(Math.round(diff))}d</span>;
  if (diff === 0) return <span className="font-mono text-xs text-amber px-2 py-0.5 border border-amber/40">Due today</span>;
  return <span className="font-mono text-xs text-muted px-2 py-0.5 border border-border">Due in {Math.round(diff)}d</span>;
}

export default function TopicCard({ item, onRevise, onDelete, style }) {
  const isMastered = item.stage >= 3;
  const isDue = (() => {
    if (isMastered || !item.next_due_at) return false;
    const now = DateTime.now().setZone(NPT);
    const due = DateTime.fromISO(item.next_due_at).setZone(NPT);
    return due.startOf('day') <= now.startOf('day');
  })();

  return (
    <div style={style} className={`card fade-up relative group ${isDue ? 'border-amber/40' : ''}`}>
      <div className="flex gap-1.5 mb-3">
        {STAGE_LABELS.map((_, i) => (
          <div key={i} title={STAGE_LABELS[i]}
            className={`stage-dot ${i < item.stage ? STAGE_COLORS[Math.min(i+1,3)] : 'bg-border'}`} />
        ))}
        <span className="ml-2 font-mono text-xs text-muted self-center">{STAGE_LABELS[Math.min(item.stage,3)]}</span>
      </div>

      <h3 className={`font-display text-lg leading-snug mb-1 ${isMastered ? 'text-muted line-through' : 'text-warm'}`}>
        {item.title}
      </h3>

      {item.question && (
        <p className="font-mono text-xs text-muted italic mb-2 border-l-2 border-border pl-3">{item.question}</p>
      )}
      {item.notes && (
        <p className="font-mono text-xs text-[#a09080] mb-3 leading-relaxed">{item.notes}</p>
      )}
      {item.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {item.tags.map(t => <span key={t} className="tag-pill">{t}</span>)}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <DueBadge item={item} />
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {!isMastered && (
            <button onClick={() => onRevise(item.id)}
              className="font-mono text-xs px-3 py-1 bg-amber/10 text-amber border border-amber/30 hover:bg-amber hover:text-ink transition-all duration-150">
              Revised ✓
            </button>
          )}
          <button onClick={() => onDelete(item.id)}
            className="font-mono text-xs px-3 py-1 text-muted border border-border hover:border-ember hover:text-ember transition-all duration-150">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
