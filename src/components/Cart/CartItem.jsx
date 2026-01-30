import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useProduct } from '../../context/ProductContext';
import { formatPrice } from '../../utils/helpers';
import Modal from '../Common/Modal';
import { useState } from 'react';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart, saveForLater } = useCart();
  const { getProductById } = useProduct();
  const product = getProductById(item.productId);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const maxQty = item.stockCount || 99;
  const subtotal = item.price * item.quantity;

  return (
    <>
      <div
        data-testid={`cart-item-${item.productId}`}
        style={{
          display: 'flex',
          gap: 16,
          padding: 16,
          background: 'var(--white)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: 12,
        }}
      >
        <Link to={`/product/${item.productId}`} style={{ flexShrink: 0 }}>
          <img
            src={item.image}
            alt={item.name}
            data-testid={`cart-item-image-${item.productId}`}
            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
          />
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link to={`/product/${item.productId}`} style={{ fontWeight: 600, color: 'var(--text)', textDecoration: 'none' }}>
            {item.name}
          </Link>
          <p style={{ margin: '4px 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }} data-testid={`cart-item-price-${item.productId}`}>
            {formatPrice(item.price)} each
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <button
              type="button"
              data-testid={`btn-decrease-quantity-${item.productId}`}
              onClick={() => updateQuantity(item.productId, item.quantity - 1, item.options)}
              disabled={item.quantity <= 1}
              style={{ width: 32, height: 32, border: '1px solid var(--secondary)', borderRadius: 'var(--radius-sm)', background: 'var(--white)', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer' }}
            >
              −
            </button>
            <span data-testid={`cart-item-quantity-${item.productId}`} style={{ minWidth: 32, textAlign: 'center' }}>
              {item.quantity}
            </span>
            <button
              type="button"
              data-testid={`btn-increase-quantity-${item.productId}`}
              onClick={() => updateQuantity(item.productId, item.quantity + 1, item.options)}
              disabled={item.quantity >= maxQty}
              style={{ width: 32, height: 32, border: '1px solid var(--secondary)', borderRadius: 'var(--radius-sm)', background: 'var(--white)', cursor: item.quantity >= maxQty ? 'not-allowed' : 'pointer' }}
            >
              +
            </button>
          </div>
          <p style={{ marginTop: 8, fontWeight: 600 }} data-testid={`cart-item-subtotal-${item.productId}`}>
            {formatPrice(subtotal)}
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button
              type="button"
              data-testid={`btn-remove-item-${item.productId}`}
              onClick={() => setShowRemoveModal(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)', fontSize: '0.875rem' }}
            >
              Remove
            </button>
            <button
              type="button"
              data-testid={`btn-save-for-later-${item.productId}`}
              onClick={() => saveForLater(item.productId)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: '0.875rem' }}
            >
              Save for Later
            </button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        title="Remove item"
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" data-testid="btn-cancel-remove" onClick={() => setShowRemoveModal(false)} style={{ padding: '8px 16px', border: '1px solid var(--secondary)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
              Cancel
            </button>
            <button
              type="button"
              data-testid="btn-confirm-remove"
              onClick={() => {
                removeFromCart(item.productId, item.options);
                setShowRemoveModal(false);
              }}
              style={{ padding: '8px 16px', background: 'var(--error)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
            >
              Remove
            </button>
          </div>
        }
      >
        <p>Remove this item from cart?</p>
      </Modal>
    </>
  );
}
