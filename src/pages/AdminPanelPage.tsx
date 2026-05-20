import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  EyeIcon,
  EyeOffIcon,
  StoreIcon,
  CreditCardIcon,
  RotateCcwIcon
} from 'lucide-react';
import { SiteStudioLayout, type StudioNavId } from '../admin/SiteStudioLayout';
import { AdminWebsiteEditor } from '../admin/AdminWebsiteEditor';
import { SiteDashboardPanel } from '../admin/SiteDashboardPanel';
import { SitePagesPanel } from '../admin/SitePagesPanel';
import {
  StudioHomePanel,
  StudioMediaPanel,
  StudioNavPanel,
  StudioSectionsPanel,
  StudioSeoPanel,
  StudioThemePanel
} from '../admin/StudioInspectorPanels';
import { PAYMENT_LABELS, useStore } from '../context/StoreContext';
import { formatRp } from '../lib/money';
import type { CatalogProduct, PaymentMethodKey } from '../types/commerce';
import { useAuth } from '../App';
const BG = '#0f0a12';
const CARD = 'rgba(255,255,255,0.06)';
const BORDER = 'rgba(255,255,255,0.1)';
const ACCENT = '#9E055F';
const ACCENT_DARK = '#7a0449';

function monthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function AdminPanelPage() {
  const store = useStore();
  const { signOut } = useAuth();
  const [tab, setTab] = useState<StudioNavId>('site-dashboard');
  const [editorPageId, setEditorPageId] = useState('pg-home');

  const lock = () => {
    signOut();
  };

  const revenueByMonth = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of store.orders) {
      const k = monthKey(o.createdAt);
      map.set(k, (map.get(k) ?? 0) + o.totalRp);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12);
  }, [store.orders]);

  const editorPreviewPath = useMemo(() => {
    if (tab !== 'block-editor') return '/';
    const slug =
      store.builderPages.find((p) => p.id === editorPageId)?.slug ?? 'home';
    return `/p/${slug}`;
  }, [tab, store.builderPages, editorPageId]);

  const topProducts = useMemo(() => {
    const { unitsSoldByProductId } = store.analytics;
    return [...store.products]
      .map((p) => ({
        product: p,
        units: unitsSoldByProductId[p.id] ?? 0
      }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 8);
  }, [store.products, store.analytics]);

  const rightPanel = (
    <>
      {tab === 'site-dashboard' && <SiteDashboardPanel />}
      {tab === 'site-pages' && (
        <SitePagesPanel
          onEditPage={(id) => {
            setEditorPageId(id);
            setTab('block-editor');
          }}
        />
      )}
      {tab === 'block-editor' && <AdminWebsiteEditor pageId={editorPageId} />}
      {tab === 'home-editor' && <StudioHomePanel />}
      {tab === 'theme' && <StudioThemePanel />}
      {tab === 'navigation' && <StudioNavPanel />}
      {tab === 'sections' && <StudioSectionsPanel />}
      {tab === 'seo' && <StudioSeoPanel />}
      {tab === 'media' && <StudioMediaPanel />}
      {tab === 'overview' && (
        <OverviewSection store={store} revenueByMonth={revenueByMonth} />
      )}
      {tab === 'products' && <ProductsSection store={store} />}
      {tab === 'pricing' && <PricingSection store={store} />}
      {tab === 'billing' && <BillingSection store={store} />}
      {tab === 'orders' && <OrdersSection store={store} />}
      {tab === 'analytics' && (
        <AnalyticsSection
          store={store}
          revenueByMonth={revenueByMonth}
          topProducts={topProducts}
        />
      )}
      {tab === 'settings' && <SettingsSection store={store} />}
    </>
  );

  return (
    <SiteStudioLayout
      panel={tab}
      onPanel={setTab}
      rightPanel={rightPanel}
      onLock={lock}
      previewPath={editorPreviewPath}
    />
  );
}

function cardClass() {
  return 'rounded-2xl border p-5 lg:p-6';
}

function OverviewSection({
  store,
  revenueByMonth
}: {
  store: ReturnType<typeof useStore>;
  revenueByMonth: [string, number][];
}) {
  const a = store.analytics;
  const maxBar =
    revenueByMonth.reduce((m, [, v]) => Math.max(m, v), 0) || 1;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Revenue (all time)', value: formatRp(a.totalRevenueRp) },
          { label: 'Orders', value: String(a.orderCount) },
          { label: 'Avg. order', value: formatRp(a.averageOrderRp) },
          { label: 'Last 30 days', value: formatRp(a.last30DaysRevenueRp) }
        ].map((k) => (
          <div
            key={k.label}
            className={cardClass()}
            style={{ backgroundColor: CARD, borderColor: BORDER }}
          >
            <p className="font-mono text-[10px] text-white/45 uppercase tracking-widest">
              {k.label}
            </p>
            <p className="font-anton text-2xl lg:text-3xl mt-2">{k.value}</p>
          </div>
        ))}
      </div>
      <div
        className={cardClass()}
        style={{ backgroundColor: CARD, borderColor: BORDER }}
      >
        <p className="font-anton text-lg mb-4">Revenue by month</p>
        <div className="flex items-end gap-1 h-40">
          {revenueByMonth.length === 0 ? (
            <p className="font-mono text-xs text-white/40">
              No orders yet — completed checkouts appear here.
            </p>
          ) : (
            revenueByMonth.map(([m, v]) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(8, (v / maxBar) * 100)}%` }}
                  className="w-full rounded-t-md min-h-[8px]"
                  style={{
                    backgroundColor: v === maxBar ? '#FF0000' : 'rgba(255,255,255,0.25)'
                  }}
                />
                <span className="font-mono text-[9px] text-white/35 truncate w-full text-center">
                  {m}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div
          className={cardClass()}
          style={{ backgroundColor: CARD, borderColor: BORDER }}
        >
          <p className="font-anton text-lg mb-2">Catalog</p>
          <p className="font-mono text-sm text-white/60">
            {store.products.filter((p) => p.active).length} active /{' '}
            {store.products.length} total products
          </p>
        </div>
        <div
          className={cardClass()}
          style={{ backgroundColor: CARD, borderColor: BORDER }}
        >
          <p className="font-anton text-lg mb-2">Tax & promo</p>
          <p className="font-mono text-sm text-white/60">
            VAT {store.taxRatePercent}% · Promo {store.promoPercent}% off subtotal
          </p>
        </div>
      </div>
    </div>
  );
}

function emptyProduct(): CatalogProduct {
  return {
    id: typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `new-${Date.now()}`,
    name: '',
    priceRp: 0,
    category: 'FACE OILS',
    image: '',
    description: '',
    active: true
  };
}

function ProductsSection({ store }: { store: ReturnType<typeof useStore> }) {
  const [draft, setDraft] = useState<CatalogProduct | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-anton text-2xl">Products</p>
          <p className="font-mono text-xs text-white/45 mt-1">
            Changes apply to the shop immediately (saved in this browser).
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDraft(emptyProduct())}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-white"
          style={{ backgroundColor: '#FF0000' }}
        >
          <PlusIcon className="w-4 h-4" />
          Add product
        </button>
      </div>

      {draft && (
        <ProductEditor
          title="New product"
          value={draft}
          onChange={setDraft}
          onSave={() => {
            store.upsertProduct(draft);
            setDraft(null);
          }}
          onCancel={() => setDraft(null)}
        />
      )}

      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: CARD, borderColor: BORDER }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}>
              <tr className="text-white/45 uppercase tracking-widest">
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {store.products.map((p) => (
                <ProductRow key={p.id} product={p} store={store} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProductRow({
  product,
  store
}: {
  product: CatalogProduct;
  store: ReturnType<typeof useStore>;
}) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(product);

  if (editing) {
    return (
      <tr className="border-t align-top" style={{ borderColor: BORDER }}>
        <td colSpan={5} className="p-4">
          <ProductEditor
            title="Edit product"
            value={local}
            onChange={setLocal}
            onSave={() => {
              store.upsertProduct(local);
              setEditing(false);
            }}
            onCancel={() => {
              setLocal(product);
              setEditing(false);
            }}
          />
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-t" style={{ borderColor: BORDER }}>
      <td className="p-3">
        <div className="flex items-center gap-3 min-w-[200px]">
          {product.image ? (
            <img
              src={product.image}
              alt=""
              className="w-10 h-10 rounded-lg object-cover bg-white/10"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-white/10" />
          )}
          <span className="text-white font-bold line-clamp-2">{product.name}</span>
        </div>
      </td>
      <td className="p-3 text-white/60">{product.category}</td>
      <td className="p-3">{formatRp(product.priceRp)}</td>
      <td className="p-3">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
          style={{
            backgroundColor: product.active
              ? 'rgba(34,197,94,0.15)'
              : 'rgba(248,113,113,0.15)',
            color: product.active ? '#86efac' : '#fca5a5'
          }}
        >
          {product.active ? (
            <EyeIcon className="w-3 h-3" />
          ) : (
            <EyeOffIcon className="w-3 h-3" />
          )}
          {product.active ? 'Active' : 'Hidden'}
        </span>
      </td>
      <td className="p-3 text-right space-x-2 whitespace-nowrap">
        <button
          type="button"
          onClick={() => store.setProductActive(product.id, !product.active)}
          className="rounded-lg border px-2 py-1 text-[10px] uppercase tracking-widest"
          style={{ borderColor: BORDER }}
        >
          Toggle
        </button>
        <button
          type="button"
          onClick={() => {
            setLocal(product);
            setEditing(true);
          }}
          className="rounded-lg border px-2 py-1 text-[10px] uppercase tracking-widest inline-flex items-center gap-1"
          style={{ borderColor: BORDER }}
        >
          <PencilIcon className="w-3 h-3" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => {
            if (confirm(`Delete “${product.name}”?`)) store.removeProduct(product.id);
          }}
          className="rounded-lg border px-2 py-1 text-[10px] uppercase tracking-widest text-red-300 border-red-900/50"
        >
          <Trash2Icon className="w-3 h-3 inline" />
        </button>
      </td>
    </tr>
  );
}

function ProductEditor({
  title,
  value,
  onChange,
  onSave,
  onCancel
}: {
  title: string;
  value: CatalogProduct;
  onChange: (p: CatalogProduct) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="rounded-2xl border p-4 space-y-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.35)', borderColor: BORDER }}
    >
      <p className="font-anton text-lg">{title}</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field
          label="Name"
          value={value.name}
          onChange={(name) => onChange({ ...value, name })}
        />
        <Field
          label="Price (Rp, numbers only)"
          value={String(value.priceRp || '')}
          onChange={(s) =>
            onChange({
              ...value,
              priceRp: Math.max(0, parseInt(s.replace(/\D/g, ''), 10) || 0)
            })
          }
        />
        <Field
          label="Category"
          value={value.category}
          onChange={(category) => onChange({ ...value, category })}
        />
        <Field
          label="Image URL"
          value={value.image}
          onChange={(image) => onChange({ ...value, image })}
        />
        <div className="sm:col-span-2">
          <label className="block font-mono text-[10px] text-white/45 uppercase tracking-widest mb-1">
            Description
          </label>
          <textarea
            value={value.description}
            onChange={(e) => onChange({ ...value, description: e.target.value })}
            rows={3}
            className="w-full rounded-xl border px-3 py-2 font-mono text-xs text-white bg-black/30 outline-none"
            style={{ borderColor: BORDER }}
          />
        </div>
        <label className="sm:col-span-2 flex items-center gap-2 font-mono text-xs text-white/70">
          <input
            type="checkbox"
            checked={value.active}
            onChange={(e) => onChange({ ...value, active: e.target.checked })}
          />
          Visible in shop
        </label>
      </div>
      <div className="flex flex-wrap gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border px-4 py-2 font-mono text-xs uppercase tracking-widest"
          style={{ borderColor: BORDER }}
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!value.name.trim() || !value.image.trim()}
          onClick={onSave}
          className="rounded-xl px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-white disabled:opacity-40"
          style={{ backgroundColor: ACCENT }}
        >
          Save product
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] text-white/45 uppercase tracking-widest mb-1">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border px-3 py-2 font-mono text-xs text-white bg-black/30 outline-none"
        style={{ borderColor: BORDER }}
      />
    </div>
  );
}

function PricingSection({ store }: { store: ReturnType<typeof useStore> }) {
  return (
    <div className="max-w-xl space-y-6">
      <p className="font-anton text-2xl">Pricing & tax</p>
      <div
        className={cardClass()}
        style={{ backgroundColor: CARD, borderColor: BORDER }}
      >
        <label className="block font-mono text-[10px] text-white/45 uppercase tracking-widest mb-2">
          VAT / sales tax (%)
        </label>
        <input
          type="number"
          min={0}
          max={100}
          step={0.5}
          value={store.taxRatePercent}
          onChange={(e) => store.setTaxRatePercent(Number(e.target.value))}
          className="w-full rounded-xl border px-3 py-2 font-mono text-sm text-white bg-black/30 outline-none"
          style={{ borderColor: BORDER }}
        />
        <p className="font-mono text-[11px] text-white/40 mt-2">
          Applied to subtotal (after promo) plus shipping at checkout.
        </p>
      </div>
      <div
        className={cardClass()}
        style={{ backgroundColor: CARD, borderColor: BORDER }}
      >
        <label className="block font-mono text-[10px] text-white/45 uppercase tracking-widest mb-2">
          Storewide promo (% off subtotal)
        </label>
        <input
          type="number"
          min={0}
          max={50}
          step={1}
          value={store.promoPercent}
          onChange={(e) => store.setPromoPercent(Number(e.target.value))}
          className="w-full rounded-xl border px-3 py-2 font-mono text-sm text-white bg-black/30 outline-none"
          style={{ borderColor: BORDER }}
        />
      </div>
    </div>
  );
}

function BillingSection({ store }: { store: ReturnType<typeof useStore> }) {
  const keys = Object.keys(store.paymentEnabled) as PaymentMethodKey[];
  return (
    <div className="max-w-2xl space-y-6">
      <p className="font-anton text-2xl">Shipping & billing</p>
      <div
        className={cardClass()}
        style={{ backgroundColor: CARD, borderColor: BORDER }}
      >
        <p className="font-mono text-xs text-white/50 mb-4 uppercase tracking-widest">
          Shipping rules
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] text-white/45 uppercase tracking-widest mb-2">
              Flat shipping (Rp)
            </label>
            <input
              type="number"
              min={0}
              step={1000}
              value={store.shippingFlatRp}
              onChange={(e) =>
                store.setShippingFlatRp(Number(e.target.value))
              }
              className="w-full rounded-xl border px-3 py-2 font-mono text-sm text-white bg-black/30 outline-none"
              style={{ borderColor: BORDER }}
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] text-white/45 uppercase tracking-widest mb-2">
              Free shipping over (Rp)
            </label>
            <input
              type="number"
              min={0}
              step={10000}
              value={store.freeShippingOverRp}
              onChange={(e) =>
                store.setFreeShippingOverRp(Number(e.target.value))
              }
              className="w-full rounded-xl border px-3 py-2 font-mono text-sm text-white bg-black/30 outline-none"
              style={{ borderColor: BORDER }}
            />
          </div>
        </div>
      </div>
      <div
        className={cardClass()}
        style={{ backgroundColor: CARD, borderColor: BORDER }}
      >
        <p className="font-mono text-xs text-white/50 mb-4 uppercase tracking-widest flex items-center gap-2">
          <CreditCardIcon className="w-4 h-4" />
          Payment methods (checkout)
        </p>
        <div className="space-y-2">
          {keys.map((k) => (
            <label
              key={k}
              className="flex items-center justify-between gap-3 rounded-xl border px-3 py-3"
              style={{ borderColor: BORDER }}
            >
              <div>
                <p className="font-mono text-xs text-white font-bold">
                  {PAYMENT_LABELS[k].title}
                </p>
                <p className="font-mono text-[10px] text-white/45">
                  {PAYMENT_LABELS[k].subtitle}
                </p>
              </div>
              <input
                type="checkbox"
                checked={store.paymentEnabled[k]}
                onChange={(e) =>
                  store.setPaymentEnabled({ [k]: e.target.checked })
                }
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrdersSection({ store }: { store: ReturnType<typeof useStore> }) {
  return (
    <div className="space-y-4">
      <p className="font-anton text-2xl">Orders</p>
      {store.orders.length === 0 ? (
        <p className="font-mono text-sm text-white/45">
          No orders recorded yet. Completing checkout from the storefront creates
          entries here.
        </p>
      ) : (
        <div className="space-y-3">
          {store.orders.map((o) => (
            <div
              key={o.id + o.createdAt}
              className={cardClass()}
              style={{ backgroundColor: CARD, borderColor: BORDER }}
            >
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <p className="font-anton text-lg">{o.id}</p>
                  <p className="font-mono text-[11px] text-white/45">
                    {new Date(o.createdAt).toLocaleString()} ·{' '}
                    {PAYMENT_LABELS[o.paymentMethod].title}
                  </p>
                </div>
                <p className="font-anton text-xl">{formatRp(o.totalRp)}</p>
              </div>
              <p className="font-mono text-xs text-white/60 mt-2">
                {o.customerName} · {o.customerEmail}
              </p>
              <ul className="mt-3 space-y-1 font-mono text-[11px] text-white/70">
                {o.items.map((l) => (
                  <li key={l.productId + l.name}>
                    {l.name} ×{l.quantity} — {formatRp(l.lineTotalRp)}
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-4 font-mono text-[10px] text-white/45 uppercase tracking-widest">
                <span>Subtotal {formatRp(o.subtotalRp)}</span>
                <span>Tax {formatRp(o.taxRp)}</span>
                <span>Ship {formatRp(o.shippingRp)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AnalyticsSection({
  store,
  revenueByMonth,
  topProducts
}: {
  store: ReturnType<typeof useStore>;
  revenueByMonth: [string, number][];
  topProducts: { product: CatalogProduct; units: number }[];
}) {
  const a = store.analytics;
  const maxU = topProducts.reduce((m, x) => Math.max(m, x.units), 0) || 1;
  return (
    <div className="space-y-6">
      <p className="font-anton text-2xl">Analytics</p>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          ['Conversion proxy', `${a.orderCount} orders`],
          ['Revenue / order', formatRp(a.averageOrderRp)],
          ['Active SKUs', String(store.products.filter((p) => p.active).length)]
        ].map(([k, v]) => (
          <div
            key={String(k)}
            className={cardClass()}
            style={{ backgroundColor: CARD, borderColor: BORDER }}
          >
            <p className="font-mono text-[10px] text-white/45 uppercase tracking-widest">
              {k}
            </p>
            <p className="font-anton text-xl mt-2">{v}</p>
          </div>
        ))}
      </div>
      <div
        className={cardClass()}
        style={{ backgroundColor: CARD, borderColor: BORDER }}
      >
        <p className="font-anton text-lg mb-4">Top products by units sold</p>
        <div className="space-y-3">
          {topProducts.every((x) => x.units === 0) ? (
            <p className="font-mono text-xs text-white/40">
              No unit sales yet — data builds from completed orders.
            </p>
          ) : (
            topProducts.map(({ product, units }) => (
              <div key={product.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs text-white truncate">
                    {product.name}
                  </p>
                  <div className="mt-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(units / maxU) * 100}%`,
                        backgroundColor: '#FF0000'
                      }}
                    />
                  </div>
                </div>
                <span className="font-mono text-xs text-white/60 shrink-0">
                  {units} sold
                </span>
              </div>
            ))
          )}
        </div>
      </div>
      <div
        className={cardClass()}
        style={{ backgroundColor: CARD, borderColor: BORDER }}
      >
        <p className="font-anton text-lg mb-2">Monthly revenue (table)</p>
        <div className="overflow-x-auto font-mono text-xs">
          <table className="w-full text-left">
            <thead className="text-white/40 uppercase tracking-widest text-[10px]">
              <tr>
                <th className="py-2">Month</th>
                <th className="py-2 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {revenueByMonth.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-4 text-white/40">
                    No data
                  </td>
                </tr>
              ) : (
                [...revenueByMonth].reverse().map(([m, v]) => (
                  <tr key={m} className="border-t border-white/10">
                    <td className="py-2">{m}</td>
                    <td className="py-2 text-right">{formatRp(v)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ store }: { store: ReturnType<typeof useStore> }) {
  return (
    <div className="max-w-xl space-y-6">
      <p className="font-anton text-2xl">Settings</p>
      <div
        className={cardClass()}
        style={{ backgroundColor: CARD, borderColor: BORDER }}
      >
        <label className="block font-mono text-[10px] text-white/45 uppercase tracking-widest mb-2">
          Top announcement bar
        </label>
        <textarea
          value={store.announcementLine}
          onChange={(e) => store.setAnnouncementLine(e.target.value)}
          rows={3}
          className="w-full rounded-xl border px-3 py-2 font-mono text-xs text-white bg-black/30 outline-none"
          style={{ borderColor: BORDER }}
        />
        <p className="font-mono text-[10px] text-white/35 mt-2">
          Shown on every page in the public header bar.
        </p>
      </div>
      <div
        className={cardClass()}
        style={{ backgroundColor: CARD, borderColor: BORDER }}
      >
        <p className="font-anton text-lg text-amber-200 mb-2">Danger zone</p>
        <p className="font-mono text-xs text-white/50 mb-4">
          Reset catalog, pricing, orders, and settings to defaults. This
          cannot be undone.
        </p>
        <button
          type="button"
          onClick={() => {
            if (confirm('Reset all store data to defaults?')) {
              store.resetStore();
            }
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-red-900/60 px-4 py-2 font-mono text-xs uppercase tracking-widest text-red-200"
        >
          <RotateCcwIcon className="w-4 h-4" />
          Reset store data
        </button>
      </div>
    </div>
  );
}
