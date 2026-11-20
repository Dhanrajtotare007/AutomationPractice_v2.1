import { useMemo, useRef, useState } from 'react';
import { GripVertical, Move, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { OutputPanel, PracticeGrid } from './PracticeGrid';
import { useNotify } from '@/components/ui/Toast';
import { cx } from '@/lib/utils';

type Zone = 'todo' | 'progress' | 'done';

interface CardItem {
  id: number;
  label: string;
  zone: Zone;
}

const ZONES: { key: Zone; title: string; hint: string; tone: string }[] = [
  { key: 'todo', title: 'To Do', hint: 'Drop accepted here', tone: 'border-slate-300 dark:border-slate-700' },
  { key: 'progress', title: 'In Progress', hint: 'Working on it', tone: 'border-amber-300 dark:border-amber-800' },
  { key: 'done', title: 'Done', hint: 'Verified', tone: 'border-emerald-300 dark:border-emerald-800' },
];

const INITIAL: CardItem[] = [
  { id: 1, label: 'Write locator tests', zone: 'todo' },
  { id: 2, label: 'Fix flaky login spec', zone: 'todo' },
  { id: 3, label: 'Add API contract tests', zone: 'progress' },
  { id: 4, label: 'Review trace viewer output', zone: 'done' },
];

export function DragDropModule() {
  const notify = useNotify();
  const [items, setItems] = useState<CardItem[]>(INITIAL);
  const [dragging, setDragging] = useState<number | null>(null);
  const [overZone, setOverZone] = useState<Zone | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [nextId, setNextId] = useState(5);
  const [rejectOver, setRejectOver] = useState(false);
  const [simpleOver, setSimpleOver] = useState(false);
  const [pointerItem, setPointerItem] = useState<number | null>(null);
  const pointerStart = useRef(false);

  const pushLog = (message: string) => setLog((current) => [message, ...current].slice(0, 6));

  const moveTo = (id: number, zone: Zone) => {
    const item = items.find((entry) => entry.id === id);
    setItems((current) => current.map((entry) => (entry.id === id ? { ...entry, zone } : entry)));
    pushLog(`Moved “${item?.label ?? id}” to ${ZONES.find((z) => z.key === zone)?.title}`);
  };

  const addItem = () => {
    const label = `New task #${nextId}`;
    setItems((current) => [...current, { id: nextId, label, zone: 'todo' }]);
    pushLog(`Created “${label}”`);
    setNextId((id) => id + 1);
  };

  const removeItem = (id: number) => {
    const item = items.find((entry) => entry.id === id);
    setItems((current) => current.filter((entry) => entry.id !== id));
    pushLog(`Deleted “${item?.label ?? id}”`);
  };

  const counts = useMemo(
    () =>
      ZONES.map((zone) => ({
        ...zone,
        count: items.filter((item) => item.zone === zone.key).length,
      })),
    [items],
  );

  const handlePointerDown = (event: React.PointerEvent, id: number) => {
    if ((event.target as HTMLElement).closest('button')) return;
    pointerStart.current = true;
    setPointerItem(id);
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (!pointerStart.current || pointerItem === null) return;
    pointerStart.current = false;
    const zoneEl = document
      .elementsFromPoint(event.clientX, event.clientY)
      .find((el) => el instanceof HTMLElement && el.dataset.zone) as HTMLElement | undefined;
    const zone = zoneEl?.dataset.zone as Zone | undefined;
    if (zone) {
      moveTo(pointerItem, zone);
      notify.success('Card moved', `${items.find((item) => item.id === pointerItem)?.label} → ${ZONES.find((z) => z.key === zone)?.title}`);
    } else {
      pushLog('Pointer drop outside of a zone (ignored)');
    }
    setPointerItem(null);
  };

  return (
    <PracticeGrid
      aside={
        <>
          <OutputPanel title="Drop log" tone="info" testId="drag-log">
            {log.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">Drag a card to record an action.</p>
            ) : (
              <ul className="space-y-1 text-xs" data-testid="drag-log-list">
                {log.map((entry, index) => (
                  <li key={`${entry}-${index}`} className="rounded-md bg-white/70 px-2 py-1 dark:bg-slate-900/60">
                    {entry}
                  </li>
                ))}
              </ul>
            )}
          </OutputPanel>
          <Card testId="drag-state">
            <CardHeader title="Board state" description="Live count per column." />
            <ul className="space-y-1 text-sm">
              {counts.map((zone) => (
                <li key={zone.key} className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">{zone.title}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100" data-testid={`drag-count-${zone.key}`}>
                    {zone.count}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </>
      }
    >
      <Card testId="drag-board">
        <CardHeader
          icon={<Move className="h-4 w-4" aria-hidden />}
          title="Kanban board — HTML5 drag & drop"
          description="Drag a card into any column. Cards also support pointer-based dragging for touch and mouse."
          actions={
            <Button size="sm" variant="outline" leftIcon={<Plus className="h-3.5 w-3.5" aria-hidden />} onClick={addItem} data-testid="drag-add">
              Add New Item
            </Button>
          }
        />

        <div className="grid gap-3 sm:grid-cols-3">
          {ZONES.map((zone) => (
            <section
              key={zone.key}
              data-testid={`drop-zone-${zone.key}`}
              data-zone={zone.key}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'move';
                setOverZone(zone.key);
              }}
              onDragLeave={() => setOverZone(null)}
              onDrop={(event) => {
                event.preventDefault();
                const raw = event.dataTransfer.getData('text/plain');
                const id = Number(raw);
                setOverZone(null);
                if (!raw || !Number.isFinite(id) || id <= 0) {
                  pushLog('Drop rejected: unknown payload');
                  notify.warning('Drop rejected', 'The dragged element did not carry a valid id.');
                  return;
                }
                moveTo(id, zone.key);
              }}
              className={cx(
                'min-h-[220px] rounded-xl border-2 border-dashed p-2.5 transition',
                zone.tone,
                overZone === zone.key && 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/30',
              )}
              aria-label={`${zone.title} drop zone`}
            >
              <header className="mb-2 flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">{zone.title}</h3>
                <Badge tone="neutral">{counts.find((entry) => entry.key === zone.key)?.count ?? 0}</Badge>
              </header>
              <ul className="space-y-2">
                {items
                  .filter((item) => item.zone === zone.key)
                  .map((item) => (
                    <li
                      key={item.id}
                      draggable
                      data-testid={`drag-item-${item.id}`}
                      data-zone={zone.key}
                      onDragStart={(event) => {
                        event.dataTransfer.setData('text/plain', String(item.id));
                        event.dataTransfer.effectAllowed = 'move';
                        setDragging(item.id);
                      }}
                      onDragEnd={() => setDragging(null)}
                      onPointerDown={(event) => handlePointerDown(event, item.id)}
                      onPointerUp={handlePointerUp}
                      className={cx(
                        'group flex touch-none cursor-grab select-none items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm shadow-sm transition active:cursor-grabbing dark:border-slate-700 dark:bg-slate-800',
                        dragging === item.id && 'opacity-40',
                        pointerItem === item.id && 'ring-2 ring-brand-400',
                      )}
                    >
                      <GripVertical className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                      <span className="min-w-0 flex-1 truncate text-slate-800 dark:text-slate-100">{item.label}</span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Delete ${item.label}`}
                        className="rounded p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                        data-testid={`drag-delete-${item.id}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </li>
                  ))}
                {items.filter((item) => item.zone === zone.key).length === 0 ? (
                  <li className="rounded-lg border border-dashed border-slate-200 px-2 py-6 text-center text-[11px] text-slate-400 dark:border-slate-700">
                    Drop here
                  </li>
                ) : null}
              </ul>
            </section>
          ))}
        </div>
        <p className="help mt-2" data-testid="drag-status">
          {dragging ? `Dragging item #${dragging}` : pointerItem ? `Pointer dragging item #${pointerItem}` : 'Idle'}
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card testId="drop-zone-reject-card">
          <CardHeader title="Rejecting drop zone" description="This zone refuses every drop and reports the rejection." />
          <div
            data-testid="drop-zone-reject"
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = 'none';
              setRejectOver(true);
            }}
            onDragLeave={() => setRejectOver(false)}
            onDrop={(event) => {
              event.preventDefault();
              setRejectOver(false);
              pushLog('Drop rejected by the “no-drop” zone');
              notify.error('Drop rejected', 'This zone does not accept draggable cards.');
            }}
            className={cx(
              'grid h-28 place-items-center rounded-xl border-2 border-dashed border-red-300 bg-red-50/60 px-3 text-center text-xs font-semibold text-red-600 transition dark:border-red-900 dark:bg-red-950/30 dark:text-red-300',
              rejectOver && 'scale-[1.01] border-red-500',
            )}
          >
            Unsuccessful drop target (always rejects)
          </div>
        </Card>

        <Card testId="drop-zone-simple-card">
          <CardHeader title="Simple drop target" description="Accepts cards and reports success." />
          <div
            data-testid="drop-zone-simple"
            data-zone="todo"
            onDragOver={(event) => {
              event.preventDefault();
              setSimpleOver(true);
            }}
            onDragLeave={() => setSimpleOver(false)}
            onDrop={(event) => {
              event.preventDefault();
              setSimpleOver(false);
              const raw = event.dataTransfer.getData('text/plain');
              const id = Number(raw);
              if (!raw || !Number.isFinite(id) || id <= 0) {
                notify.warning('Drop rejected', 'No card id was transferred.');
                return;
              }
              moveTo(id, 'todo');
              notify.success('Dropped successfully', 'The card was moved back to To Do.');
            }}
            className={cx(
              'grid h-28 place-items-center rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/60 px-3 text-center text-xs font-semibold text-emerald-700 transition dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300',
              simpleOver && 'scale-[1.01] border-emerald-500',
            )}
          >
            Successful drop target (moves card to To Do)
          </div>
        </Card>
      </div>
    </PracticeGrid>
  );
}
