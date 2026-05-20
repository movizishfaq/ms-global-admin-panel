import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CopyIcon,
  RedoIcon,
  Trash2Icon,
  UndoIcon
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  BUILDER_BLOCK_TYPES,
  defaultBlock,
  newBlockId,
  type BuilderBlock,
  type BuilderBlockType
} from '../types/builderPage';
import { BlockRenderer } from '../components/builder/BlockRenderer';

const BORDER = 'rgba(255,255,255,0.1)';
const CARD = 'rgba(255,255,255,0.06)';

function cloneBlockIds(block: BuilderBlock): BuilderBlock {
  const id = newBlockId();
  return {
    ...block,
    id,
    children: block.children?.map(cloneBlockIds)
  };
}

function SortRow({
  block,
  selected,
  onSelect
}: {
  block: BuilderBlock;
  selected: boolean;
  onSelect: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  return (
    <button
      type="button"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onSelect}
      className={`w-full text-left rounded-lg border px-3 py-2 font-mono text-[11px] uppercase tracking-widest ${
        selected ? 'border-[#9E055F] bg-[#9E055F]/25' : 'border-white/10 bg-black/25'
      }`}
    >
      {block.type}
      <span className="block text-[9px] text-white/40 normal-case tracking-normal truncate">
        {block.type === 'text'
          ? String(block.props.content ?? '').slice(0, 48)
          : block.id.slice(0, 8)}
      </span>
    </button>
  );
}

function BlockPropsForm({
  block,
  onChange
}: {
  block: BuilderBlock;
  onChange: (next: BuilderBlock) => void;
}) {
  const patch = (props: Record<string, unknown>) =>
    onChange({ ...block, props: { ...block.props, ...props } });

  switch (block.type) {
    case 'text':
      return (
        <div className="space-y-2 font-mono text-xs">
          <label className="block text-white/50 text-[10px] uppercase">Content</label>
          <textarea
            value={String(block.props.content ?? '')}
            onChange={(e) => patch({ content: e.target.value })}
            rows={3}
            className="w-full rounded border px-2 py-1.5 bg-black/30 border-white/15 text-white"
          />
          <div className="flex gap-2">
            {(['left', 'center', 'right'] as const).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => patch({ align: a })}
                className={`flex-1 rounded py-1 text-[10px] uppercase ${
                  block.props.align === a
                    ? 'bg-[#9E055F] text-white'
                    : 'bg-white/10 text-white/60'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      );
    case 'image':
      return (
        <div className="space-y-2 font-mono text-xs">
          <label className="block text-white/50 text-[10px] uppercase">Image URL</label>
          <input
            value={String(block.props.src ?? '')}
            onChange={(e) => patch({ src: e.target.value })}
            className="w-full rounded border px-2 py-1.5 bg-black/30 border-white/15 text-white"
          />
          <label className="block text-white/50 text-[10px] uppercase">Width %</label>
          <input
            type="number"
            value={Number(block.props.width) || 100}
            onChange={(e) => patch({ width: Number(e.target.value) })}
            className="w-full rounded border px-2 py-1.5 bg-black/30 border-white/15 text-white"
          />
        </div>
      );
    case 'button':
      return (
        <div className="space-y-2 font-mono text-xs">
          <label className="block text-white/50 text-[10px] uppercase">Label</label>
          <input
            value={String(block.props.label ?? '')}
            onChange={(e) => patch({ label: e.target.value })}
            className="w-full rounded border px-2 py-1.5 bg-black/30 border-white/15 text-white"
          />
          <label className="block text-white/50 text-[10px] uppercase">Link</label>
          <input
            value={String(block.props.href ?? '')}
            onChange={(e) => patch({ href: e.target.value })}
            className="w-full rounded border px-2 py-1.5 bg-black/30 border-white/15 text-white"
          />
        </div>
      );
    case 'spacer':
      return (
        <div className="space-y-2 font-mono text-xs">
          <label className="block text-white/50 text-[10px] uppercase">Height px</label>
          <input
            type="number"
            value={Number(block.props.height) || 32}
            onChange={(e) => patch({ height: Number(e.target.value) })}
            className="w-full rounded border px-2 py-1.5 bg-black/30 border-white/15 text-white"
          />
        </div>
      );
    case 'section':
      return (
        <div className="space-y-2 font-mono text-xs">
          <label className="block text-white/50 text-[10px] uppercase">Padding px</label>
          <input
            type="number"
            value={Number(block.props.padding) || 24}
            onChange={(e) => patch({ padding: Number(e.target.value) })}
            className="w-full rounded border px-2 py-1.5 bg-black/30 border-white/15 text-white"
          />
          <p className="text-[10px] text-white/40">
            Nested children editing coming soon — use duplicate/delete on root list.
          </p>
        </div>
      );
    default:
      return (
        <p className="font-mono text-[10px] text-white/45">
          Select a block. Props for “{block.type}” are minimal in this MVP.
        </p>
      );
  }
}

export function AdminWebsiteEditor({ pageId }: { pageId: string }) {
  const {
    builderPages,
    updatePageDraftBlocks,
    touchDraftSaved,
    publishSite,
    siteMeta
  } = useStore();
  const page = builderPages.find((p) => p.id === pageId);
  const blocks = page?.draftBlocks ?? [];
  const blocksRef = useRef(blocks);
  blocksRef.current = blocks;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [past, setPast] = useState<BuilderBlock[][]>([]);
  const [future, setFuture] = useState<BuilderBlock[][]>([]);

  useEffect(() => {
    setSelectedId(null);
    setPast([]);
    setFuture([]);
  }, [pageId]);

  const commit = useCallback(
    (next: BuilderBlock[], recordHistory: boolean) => {
      if (recordHistory) {
        setPast((p) => [...p.slice(-45), blocksRef.current]);
        setFuture([]);
      }
      updatePageDraftBlocks(pageId, next);
      touchDraftSaved();
    },
    [pageId, updatePageDraftBlocks, touchDraftSaved]
  );

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const prev = past[past.length - 1];
    setPast((p) => p.slice(0, -1));
    setFuture((f) => [blocksRef.current, ...f]);
    updatePageDraftBlocks(pageId, prev);
    touchDraftSaved();
  }, [past, pageId, updatePageDraftBlocks, touchDraftSaved]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const n = future[0];
    setFuture((f) => f.slice(1));
    setPast((p) => [...p, blocksRef.current]);
    updatePageDraftBlocks(pageId, n);
    touchDraftSaved();
  }, [future, pageId, updatePageDraftBlocks, touchDraftSaved]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    commit(arrayMove(blocks, oldIndex, newIndex), true);
  };

  const selected = useMemo(
    () => blocks.find((b) => b.id === selectedId) ?? null,
    [blocks, selectedId]
  );

  const moveLayer = (dir: -1 | 1) => {
    if (!selectedId) return;
    const i = blocks.findIndex((b) => b.id === selectedId);
    if (i < 0) return;
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = arrayMove(blocks, i, j);
    commit(next, true);
  };

  const removeSelected = () => {
    if (!selectedId) return;
    commit(
      blocks.filter((b) => b.id !== selectedId),
      true
    );
    setSelectedId(null);
  };

  const duplicateSelected = () => {
    if (!selectedId) return;
    const i = blocks.findIndex((b) => b.id === selectedId);
    if (i < 0) return;
    const copy = cloneBlockIds(blocks[i]);
    const next = [...blocks.slice(0, i + 1), copy, ...blocks.slice(i + 1)];
    commit(next, true);
    setSelectedId(copy.id);
  };

  const addType = (t: BuilderBlockType) => {
    commit([...blocks, defaultBlock(t)], true);
  };

  const updateSelected = (next: BuilderBlock) => {
    if (!selectedId) return;
    commit(
      blocks.map((b) => (b.id === selectedId ? next : b)),
      true
    );
  };

  if (!page) {
    return (
      <p className="p-6 font-mono text-sm text-white/50">Page not found.</p>
    );
  }

  const slug = page.slug;

  return (
    <div className="flex flex-col h-full min-h-0 text-white">
      <div
        className="shrink-0 border-b px-4 py-3 flex flex-wrap gap-2 items-center"
        style={{ borderColor: BORDER }}
      >
        <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
          {page.name}
        </span>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => undo()}
          disabled={past.length === 0}
          className="p-2 rounded-lg border border-white/10 disabled:opacity-30"
          title="Undo"
        >
          <UndoIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => redo()}
          disabled={future.length === 0}
          className="p-2 rounded-lg border border-white/10 disabled:opacity-30"
          title="Redo"
        >
          <RedoIcon className="w-4 h-4" />
        </button>
        <Link
          to={`/p/${slug}?studioDraft=1`}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest"
        >
          Preview
        </Link>
        <button
          type="button"
          onClick={() => publishSite()}
          className="rounded-lg bg-[#9E055F] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest"
        >
          Publish
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
        <div
          className="rounded-xl border p-3"
          style={{ backgroundColor: CARD, borderColor: BORDER }}
        >
          <p className="font-mono text-[10px] text-white/45 uppercase mb-2">
            Add block
          </p>
          <div className="flex flex-wrap gap-1">
            {BUILDER_BLOCK_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => addType(t)}
                className="rounded-md border border-white/10 px-2 py-1 font-mono text-[9px] uppercase text-white/70 hover:bg-white/10"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div
            className="rounded-xl border p-3 min-h-[200px]"
            style={{ backgroundColor: CARD, borderColor: BORDER }}
          >
            <p className="font-mono text-[10px] text-white/45 uppercase mb-2">
              Layer order (drag)
            </p>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={blocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1.5">
                  {blocks.map((b) => (
                    <SortRow
                      key={b.id}
                      block={b}
                      selected={selectedId === b.id}
                      onSelect={() => setSelectedId(b.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                type="button"
                onClick={() => moveLayer(-1)}
                className="inline-flex items-center gap-1 rounded border border-white/10 px-2 py-1 font-mono text-[9px] uppercase"
              >
                <ArrowUpIcon className="w-3 h-3" />
                Up
              </button>
              <button
                type="button"
                onClick={() => moveLayer(1)}
                className="inline-flex items-center gap-1 rounded border border-white/10 px-2 py-1 font-mono text-[9px] uppercase"
              >
                <ArrowDownIcon className="w-3 h-3" />
                Down
              </button>
              <button
                type="button"
                onClick={() => duplicateSelected()}
                className="inline-flex items-center gap-1 rounded border border-white/10 px-2 py-1 font-mono text-[9px] uppercase"
              >
                <CopyIcon className="w-3 h-3" />
                Duplicate
              </button>
              <button
                type="button"
                onClick={() => removeSelected()}
                className="inline-flex items-center gap-1 rounded border border-red-500/40 px-2 py-1 font-mono text-[9px] uppercase text-red-300"
              >
                <Trash2Icon className="w-3 h-3" />
                Delete
              </button>
            </div>
          </div>

          <div
            className="rounded-xl border p-3"
            style={{ backgroundColor: CARD, borderColor: BORDER }}
          >
            <p className="font-mono text-[10px] text-white/45 uppercase mb-2">
              Properties
            </p>
            {selected ? (
              <BlockPropsForm block={selected} onChange={updateSelected} />
            ) : (
              <p className="font-mono text-xs text-white/40">
                Select a block in the list.
              </p>
            )}
          </div>
        </div>

        <div
          className="rounded-xl border p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)', borderColor: BORDER }}
        >
          <p className="font-mono text-[10px] text-white/45 uppercase mb-3">
            Canvas preview
          </p>
          <div className="rounded-lg bg-[var(--primary)] p-6 text-white border border-white/10">
            <BlockRenderer blocks={blocks} />
          </div>
          <p className="mt-2 font-mono text-[9px] text-white/35">
            Live status: {siteMeta.publishStatus}. Main iframe shows the same route with theme.
          </p>
        </div>
      </div>
    </div>
  );
}
