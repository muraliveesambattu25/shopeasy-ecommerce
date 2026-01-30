import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../Common/Modal';
import Input from '../Common/Input';
import Button from '../Common/Button';

const countries = ['India', 'USA', 'UK', 'Australia', 'Canada'];
const statesByCountry = { India: ['Karnataka', 'Maharashtra', 'Tamil Nadu'], USA: ['California', 'Texas'], UK: ['England', 'Scotland'], Australia: ['NSW', 'Victoria'], Canada: ['Ontario', 'Quebec'] };

export default function AddressBook() {
  const { user, updateProfile } = useAuth();
  const addresses = user?.addresses || [];
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', country: 'India', pincode: '', type: 'Home', isDefault: false });

  const handleSave = () => {
    const addr = { ...form, id: editingIndex !== null ? addresses[editingIndex]?.id : 'addr_' + Date.now() };
    let next = editingIndex !== null ? addresses.map((a, i) => (i === editingIndex ? addr : a)) : [...addresses, addr];
    if (next.length > 5) next = next.slice(0, 5);
    updateProfile({ addresses: next });
    setShowForm(false);
    setEditingIndex(null);
  };

  const setDefault = (index) => {
    const next = addresses.map((a, i) => ({ ...a, isDefault: i === index }));
    updateProfile({ addresses: next });
  };

  return (
    <div>
      <button type="button" data-testid="btn-add-address" onClick={() => { setEditingIndex(null); setForm({ name: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', country: 'India', pincode: '', type: 'Home', isDefault: false }); setShowForm(true); }} style={{ marginBottom: 24, padding: '12px 24px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
        Add New Address
      </button>
      <div style={{ display: 'grid', gap: 16 }}>
        {addresses.map((addr, i) => (
          <div key={addr.id} data-testid={`address-card-${i}`} style={{ padding: 20, background: 'var(--white)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
            <p><strong>{addr.name}</strong> {addr.phone}</p>
            <p style={{ margin: '8px 0', color: 'var(--text-secondary)' }}>{addr.addressLine1}, {addr.addressLine2 && addr.addressLine2 + ', '}{addr.city}, {addr.state} {addr.pincode}, {addr.country}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              {addr.type && <span style={{ padding: '4px 8px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>{addr.type}</span>}
              {addr.isDefault && <span style={{ padding: '4px 8px', background: 'var(--success)', color: '#fff', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>Default</span>}
              <button type="button" data-testid={`btn-edit-address-${i}`} onClick={() => { setEditingIndex(i); setForm(addr); setShowForm(true); }} style={{ padding: '6px 12px', border: '1px solid var(--secondary)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>Edit</button>
              <button type="button" data-testid={`btn-delete-address-${i}`} onClick={() => { const next = addresses.filter((_, j) => j !== i); updateProfile({ addresses: next }); }} style={{ padding: '6px 12px', border: '1px solid var(--error)', color: 'var(--error)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'none' }}>Delete</button>
              {!addr.isDefault && <button type="button" data-testid={`btn-set-default-${i}`} onClick={() => setDefault(i)} style={{ padding: '6px 12px', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'none' }}>Set as Default</button>}
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingIndex !== null ? 'Edit Address' : 'New Address'} footer={<Button data-testid="btn-save-address" onClick={handleSave}>Save</Button>}>
        <Input label="Full Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <Input label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
        <Input label="Address Line 1" value={form.addressLine1} onChange={(e) => setForm((f) => ({ ...f, addressLine1: e.target.value }))} />
        <Input label="Address Line 2" value={form.addressLine2} onChange={(e) => setForm((f) => ({ ...f, addressLine2: e.target.value }))} />
        <Input label="City" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
        <div style={{ marginBottom: 16 }}>
          <label>State</label>
          <select value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} style={{ width: '100%', padding: '10px 12px', marginTop: 6, border: '1px solid var(--secondary)', borderRadius: 'var(--radius-md)' }}>
            {(statesByCountry[form.country] || []).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Country</label>
          <select value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value, state: '' }))} style={{ width: '100%', padding: '10px 12px', marginTop: 6, border: '1px solid var(--secondary)', borderRadius: 'var(--radius-md)' }}>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <Input label="Pincode" value={form.pincode} onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))} />
        <div style={{ marginTop: 16 }}>
          <label>Type</label>
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            {['Home', 'Work', 'Other'].map((t) => (
              <label key={t}><input type="radio" name="type" value={t} checked={form.type === t} onChange={() => setForm((f) => ({ ...f, type: t }))} /> {t}</label>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
