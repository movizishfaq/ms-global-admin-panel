import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2Icon, CheckIcon, Loader2Icon } from 'lucide-react';
import {
  fetchOrganization,
  saveOrganization,
  type OrganizationProfile
} from '../../lib/api';
import { getStoredToken } from '../../lib/authStorage';

const emptyForm = (email = ''): OrganizationProfile => ({
  organizationName: '',
  legalName: '',
  registrationId: '',
  contactPhone: '',
  contactEmail: email,
  website: '',
  addressLine: '',
  city: '',
  province: '',
  postalCode: '',
  country: 'Pakistan',
  description: ''
});

const inputClass =
  'w-full font-mono text-sm border-2 px-4 py-3 focus:outline-none transition-colors placeholder:text-white/30 rounded-lg text-white';
const inputStyle = {
  backgroundColor: 'rgba(255,255,255,0.1)',
  borderColor: 'rgba(255,255,255,0.2)'
};

function Field({
  label,
  id,
  children
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-mono text-xs uppercase tracking-widest text-white/60 mb-2"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export function OrganizationPanel({ userEmail }: { userEmail: string }) {
  const [form, setForm] = useState<OrganizationProfile>(() =>
    emptyForm(userEmail)
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }
    fetchOrganization(token)
      .then(({ organization }) => {
        setForm({
          ...emptyForm(userEmail),
          ...organization,
          contactEmail: organization.contactEmail || userEmail
        });
      })
      .catch(() => setForm(emptyForm(userEmail)))
      .finally(() => setLoading(false));
  }, [userEmail]);

  const patch = (key: keyof OrganizationProfile, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getStoredToken();
    if (!token) return;
    if (!form.organizationName.trim()) {
      setError('ORGANIZATION NAME IS REQUIRED.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const { organization } = await saveOrganization(token, {
        ...form,
        organizationName: form.organizationName.trim(),
        contactEmail: form.contactEmail.trim() || userEmail
      });
      setForm(organization);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message.toUpperCase()
          : 'COULD NOT SAVE ORGANIZATION.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2Icon className="w-8 h-8 text-white/40 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(255,0,0,0.2)' }}
        >
          <Building2Icon className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h2 className="font-anton text-2xl text-white uppercase">
            Organization Details
          </h2>
          <p className="font-mono text-xs text-white/50">
            Saved to your account in MongoDB — used for referrals & payouts
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/10 p-6 space-y-5"
        style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
      >
        <Field label="Organization / business name *" id="org-name">
          <input
            id="org-name"
            required
            value={form.organizationName}
            onChange={(e) => patch('organizationName', e.target.value)}
            placeholder="MS-GLOBAL PARTNER STORE"
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Legal name (optional)" id="legal-name">
            <input
              id="legal-name"
              value={form.legalName}
              onChange={(e) => patch('legalName', e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </Field>
          <Field label="Registration / NTN ID" id="reg-id">
            <input
              id="reg-id"
              value={form.registrationId}
              onChange={(e) => patch('registrationId', e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Contact phone" id="phone">
            <input
              id="phone"
              type="tel"
              value={form.contactPhone}
              onChange={(e) => patch('contactPhone', e.target.value)}
              placeholder="+92 300 0000000"
              className={inputClass}
              style={inputStyle}
            />
          </Field>
          <Field label="Contact email" id="org-email">
            <input
              id="org-email"
              type="email"
              value={form.contactEmail}
              onChange={(e) => patch('contactEmail', e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </Field>
        </div>

        <Field label="Website (optional)" id="website">
          <input
            id="website"
            type="url"
            value={form.website}
            onChange={(e) => patch('website', e.target.value)}
            placeholder="https://"
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <Field label="Street address" id="address">
          <input
            id="address"
            value={form.addressLine}
            onChange={(e) => patch('addressLine', e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="City" id="city">
            <input
              id="city"
              value={form.city}
              onChange={(e) => patch('city', e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </Field>
          <Field label="Province" id="province">
            <input
              id="province"
              value={form.province}
              onChange={(e) => patch('province', e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </Field>
          <Field label="Postal code" id="postal">
            <input
              id="postal"
              value={form.postalCode}
              onChange={(e) => patch('postalCode', e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </Field>
        </div>

        <Field label="Country" id="country">
          <input
            id="country"
            value={form.country}
            onChange={(e) => patch('country', e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <Field label="About your organization" id="desc">
          <textarea
            id="desc"
            rows={3}
            value={form.description}
            onChange={(e) => patch('description', e.target.value)}
            className={`${inputClass} resize-none`}
            style={inputStyle}
          />
        </Field>

        {error ? (
          <p className="font-mono text-xs text-red-400 uppercase tracking-widest">
            {error}
          </p>
        ) : null}

        <motion.button
          type="submit"
          disabled={saving}
          whileTap={{ scale: 0.98 }}
          className="w-full sm:w-auto font-mono text-sm uppercase tracking-widest text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60"
          style={{ backgroundColor: saved ? '#22c55e' : '#FF0000' }}
        >
          {saving ? (
            <Loader2Icon className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <CheckIcon className="w-4 h-4" />
          ) : null}
          {saving ? 'SAVING…' : saved ? 'SAVED' : 'SAVE ORGANIZATION'}
        </motion.button>
      </form>
    </motion.div>
  );
}
