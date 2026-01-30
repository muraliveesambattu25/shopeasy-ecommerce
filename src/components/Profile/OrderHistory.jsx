import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { formatPrice, formatDate } from '../../utils/helpers';

export default function OrderHistory() {
  const { user } = useAuth();
  const orders = user?.orders || [];
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('recent');

  const filtered = orders
    .filter((o) => filter === 'all' || o.status?.toLowerCase() === filter)
    .sort((a, b) => sort === 'recent' ? new Date(b.placedAt) - new Date(a.placedAt) : new Date(a.placedAt) - new Date(b.placedAt));

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <p style={{ marginBottom: 16 }}>You haven&apos;t placed any orders yet.</p>
        <Link to="/products" style={{ padding: '12px 24px', background: 'var(--primary)', color: '#fff', borderRadius: 'var(--radius-md)', textDecoration: 'none' }}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid var(--secondary)', borderRadius: 'var(--radius-md)' }}>
          <option value="all">All</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: '8px 12px', border: '1px solid var(--secondary)', borderRadius: 'var(--radius-md)' }}>
          <option value="recent">Recent First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.map((order) => (
          <div
            key={order.orderId}
            data-testid={`order-${order.orderId}`}
            style={{
              padding: 20,
              background: 'var(--white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p data-testid={`order-id-${order.orderId}`} style={{ fontWeight: 600, marginBottom: 4 }}>Order #{order.orderId}</p>
                <p data-testid={`order-date-${order.orderId}`} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{formatDate(order.placedAt)}</p>
              </div>
              <span
                data-testid={`order-status-${order.orderId}`}
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  background: order.status === 'Delivered' ? 'var(--success)' : order.status === 'Cancelled' ? 'var(--error)' : 'var(--warning)',
                  color: '#fff',
                }}
              >
                {order.status}
              </span>
            </div>
            <p data-testid={`order-total-${order.orderId}`} style={{ marginTop: 12, fontWeight: 600 }}>Total: {formatPrice(order.amounts?.total)}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <Link to={`/profile/orders/${order.orderId}`}>
                <button type="button" data-testid={`btn-view-order-${order.orderId}`} style={{ padding: '8px 16px', border: '1px solid var(--secondary)', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: 'var(--white)' }}>View Details</button>
              </Link>
              {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                <button type="button" data-testid={`btn-track-order-${order.orderId}`} style={{ padding: '8px 16px', border: '1px solid var(--secondary)', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: 'var(--white)' }}>Track Order</button>
              )}
              <button type="button" data-testid={`btn-buy-again-${order.orderId}`} style={{ padding: '8px 16px', border: '1px solid var(--secondary)', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: 'var(--white)' }}>Buy Again</button>
              <button type="button" data-testid={`btn-invoice-${order.orderId}`} style={{ padding: '8px 16px', border: '1px solid var(--secondary)', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: 'var(--white)' }}>Download Invoice</button>
              {order.status === 'Processing' && (
                <button type="button" data-testid={`btn-cancel-order-${order.orderId}`} style={{ padding: '8px 16px', border: '1px solid var(--error)', color: 'var(--error)', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: 'none' }}>Cancel Order</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
