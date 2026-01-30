import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Input from '../Common/Input';
import Button from '../Common/Button';
import Modal from '../Common/Modal';

const countries = ['India', 'USA', 'UK', 'Australia', 'Canada'];
const statesByCountry = {
  India: ['Karnataka', 'Maharashtra', 'Tamil Nadu', 'Delhi', 'West Bengal'],
  USA: ['California', 'Texas', 'New York', 'Florida'],
  UK: ['England', 'Scotland', 'Wales'],
  Australia: ['NSW', 'Victoria', 'Queensland'],
  Canada: ['Ontario', 'Quebec', 'British Columbia'],
};

export default function ShippingForm({ onContinue }) {
  const { user, updateProfile } = useAuth();
  const addresses = user?.addresses || [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    pincode: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    type: 'Home',
    isDefault: false,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = 'Name is required';
    if (!form.phone?.trim()) e.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) e.phone = 'Valid 10-digit phone required';
    if (!form.pincode?.trim()) e.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(form.pincode.replace(/\D/g, ''))) e.pincode = 'Valid 6-digit pincode required';
    if (!form.addressLine1?.trim()) e.addressLine1 = 'Address line 1 is required';
    if (!form.city?.trim()) e.city = 'City is required';
    if (!form.state?.trim()) e.state = 'State is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const addr = { id: editingIndex !== null ? addresses[editingIndex]?.id : 'addr_' + Date.now(), ...form, phone: form.phone.replace(/\D/g, '').slice(0, 10) };
    let next = [...addresses];
    if (editingIndex !== null) {
      next[editingIndex] = addr;
    } else {
      next.push(addr);
    }
    updateProfile({ addresses: next });
    setShowForm(false);
    setEditingIndex(null);
    setForm({ name: '', phone: '', pincode: '', addressLine1: '', addressLine2: '', city: '', state: '', country: 'India', type: 'Home', isDefault: false });
  };

  const selectedAddress = addresses[selectedIndex];

  return (
    <div data-testid="step-shipping">
      <h3 style={{ marginBottom: 16 }}>Shipping Address</h3>
      {addresses.length === 0 ? (
        <p style={{ marginBottom: 16, color: 'var(--text-secondary)' }}>No saved addresses. Add one below.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
          {addresses.map((addr, i) => (
            <div
              key={addr.id}
              data-testid={`saved-address-${i}`}
              style={{
                padding: 16,
                border: selectedIndex === i ? '2px solid var(--primary)' : '1px solid var(--secondary)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedIndex(i)}
            >
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="address"
                  checked={selectedIndex === i}
                  onChange={() => setSelectedIndex(i)}
                  data-testid={`radio-address-${i}`}
                />
                <div>
                  <strong>{addr.name}</strong>
                  <p style={{ margin: '4px 0', fontSize: '0.875rem' }}>{addr.addressLine1}, {addr.addressLine2 && addr.addressLine2 + ', '}{addr.city}, {addr.state} {addr.pincode}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{addr.phone}</p>
                </div>
              </label>
              <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                <button type="button" data-testid={`btn-edit-address-${i}`} onClick={(e) => { e.stopPropagation(); setEditingIndex(i); setForm(addr); setShowForm(true); }} style={{ padding: '6px 12px', border: '1px solid var(--secondary)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>Edit</button>
                <button type="button" data-testid={`btn-delete-address-${i}`} onClick={(e) => { e.stopPropagation(); const next = addresses.filter((_, j) => j !== i); updateProfile({ addresses: next }); setSelectedIndex(0); }} style={{ padding: '6px 12px', border: '1px solid var(--error)', color: 'var(--error)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'none' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button type="button" data-testid="btn-add-new-address" onClick={() => { setEditingIndex(null); setForm({ name: '', phone: '', pincode: '', addressLine1: '', addressLine2: '', city: '', state: '', country: 'India', type: 'Home', isDefault: false }); setShowForm(true); }} style={{ marginBottom: 16, padding: '10px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
        Add New Address
      </button>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button data-testid="btn-continue-to-payment" disabled={!selectedAddress} onClick={onContinue}>
          Continue to Payment
        </Button>
      </div>
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingIndex !== null ? 'Edit Address' : 'New Address'} footer={
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="secondary" data-testid="btn-cancel-address" onClick={() => setShowForm(false)}>Cancel</Button>
          <Button data-testid="btn-save-address" onClick={handleSave}>Save Address</Button>
        </div>
      }>
        <Input label="Full Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} data-testid="input-shipping-name" error={errors.name} required />
        <Input label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))} data-testid="input-shipping-phone" error={errors.phone} required />
        <Input label="Pincode" value={form.pincode} onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }))} data-testid="input-shipping-pincode" error={errors.pincode} required />
        <Input label="Address Line 1" value={form.addressLine1} onChange={(e) => setForm((f) => ({ ...f, addressLine1: e.target.value }))} data-testid="input-shipping-address-line1" error={errors.addressLine1} required />
        <Input label="Address Line 2" value={form.addressLine2} onChange={(e) => setForm((f) => ({ ...f, addressLine2: e.target.value }))} data-testid="input-shipping-address-line2" />
        <Input label="City" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} data-testid="input-shipping-city" error={errors.city} required />
        <div style={{ marginBottom: 16 }}>
          <label>State</label>
          <select value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} data-testid="select-shipping-state" style={{ width: '100%', padding: '10px 12px', marginTop: 6, border: '1px solid var(--secondary)', borderRadius: 'var(--radius-md)' }}>
            <option value="">Select</option>
            {(statesByCountry[form.country] || []).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Country</label>
          <select value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value, state: '' }))} data-testid="select-shipping-country" style={{ width: '100%', padding: '10px 12px', marginTop: 6, border: '1px solid var(--secondary)', borderRadius: 'var(--radius-md)' }}>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Address Type</label>
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            {['Home', 'Work', 'Other'].map((t) => (
              <label key={t}>
                <input type="radio" name="type" value={t} checked={form.type === t} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} data-testid="radio-address-type" />
                <span style={{ marginLeft: 4 }}>{t}</span>
              </label>
            ))}
          </div>
        </div>
        <label>
          <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))} data-testid="checkbox-default-address" />
          <span style={{ marginLeft: 8 }}>Make this my default address</span>
        </label>
      </Modal>
    </div>
  );
}
