import React from 'react';
import { Link } from 'react-router-dom';
import type { BuilderBlock } from '../../types/builderPage';

function alignClass(align: unknown): string {
  if (align === 'center') return 'text-center';
  if (align === 'right') return 'text-right';
  return 'text-left';
}

function textSizeClass(size: unknown): string {
  if (size === 'lg') return 'text-3xl md:text-4xl font-bold';
  if (size === 'sm') return 'text-sm md:text-base opacity-90';
  return 'text-lg';
}

export function BlockRenderer({ blocks }: { blocks: BuilderBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((b) => (
        <BlockNode key={b.id} block={b} />
      ))}
    </div>
  );
}

function BlockNode({ block: b }: { block: BuilderBlock }) {
  switch (b.type) {
    case 'text': {
      const content = String(b.props.content ?? '');
      const align = alignClass(b.props.align);
      const size = textSizeClass(b.props.size);
      return (
        <p className={`font-mono uppercase tracking-wide ${align} ${size}`}>
          {content}
        </p>
      );
    }
    case 'image': {
      const src = String(b.props.src ?? '').trim();
      const alt = String(b.props.alt ?? 'Image');
      const w = Number(b.props.width) || 100;
      if (!src) {
        return (
          <div
            className="rounded-lg border border-dashed border-white/20 bg-white/5 py-16 text-center font-mono text-xs text-white/40"
            style={{ maxWidth: `${w}%` }}
          >
            Image placeholder
          </div>
        );
      }
      return (
        <img
          src={src}
          alt={alt}
          className="max-w-full h-auto rounded-lg border border-white/10"
          style={{ width: `${w}%` }}
        />
      );
    }
    case 'button': {
      const label = String(b.props.label ?? 'Button');
      const href = String(b.props.href ?? '/');
      const variant = b.props.variant === 'secondary' ? 'secondary' : 'primary';
      const base =
        'inline-block rounded-lg px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-90';
      const cls =
        variant === 'secondary'
          ? `${base} border border-white/30 text-white`
          : `${base} bg-[#FF0000] text-white`;
      return (
        <div className="flex justify-center">
          <Link to={href} className={cls}>
            {label}
          </Link>
        </div>
      );
    }
    case 'section': {
      const pad = Number(b.props.padding) || 24;
      const children = Array.isArray(b.children) ? b.children : [];
      return (
        <section
          className="rounded-xl border border-white/10 bg-white/5"
          style={{ padding: pad }}
        >
          <BlockRenderer blocks={children} />
        </section>
      );
    }
    case 'navbar':
      return (
        <header className="rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-anton text-xl text-white">
          {String(b.props.title ?? 'Nav')}
        </header>
      );
    case 'footer':
      return (
        <footer className="rounded-lg border border-white/10 bg-black/40 px-4 py-6 font-mono text-xs text-white/60">
          {String(b.props.note ?? '')}
        </footer>
      );
    case 'form':
      return (
        <div className="rounded-xl border border-white/15 p-6 space-y-3">
          <p className="font-anton text-xl text-white">
            {String(b.props.title ?? 'Form')}
          </p>
          <p className="font-mono text-[10px] text-white/45 uppercase tracking-widest">
            Fields: {String(b.props.fields ?? '')}
          </p>
          <button
            type="button"
            className="rounded-lg bg-[#FF0000] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-white"
          >
            Submit
          </button>
        </div>
      );
    case 'spacer': {
      const h = Number(b.props.height) || 32;
      return <div style={{ height: h }} aria-hidden />;
    }
    default:
      return null;
  }
}
