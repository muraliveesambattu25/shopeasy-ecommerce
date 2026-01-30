export default function Pagination({
  currentPage,
  totalPages,
  totalResults,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  'data-testid': dataTestId,
}) {
  const options = [12, 24, 48, 96];
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalResults);

  const getPageNumbers = () => {
    const pages = [];
    const show = 7;
    let startPage = Math.max(1, currentPage - Math.floor(show / 2));
    let endPage = Math.min(totalPages, startPage + show - 1);
    if (endPage - startPage + 1 < show) startPage = Math.max(1, endPage - show + 1);
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  return (
    <div
      data-testid={dataTestId}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '16px 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span data-testid="total-results" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          {totalResults} results
        </span>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.875rem' }}>Per page</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange?.(Number(e.target.value))}
            data-testid="select-items-per-page"
            style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--secondary)' }}
          >
            {options.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          type="button"
          onClick={() => onPageChange?.(1)}
          disabled={currentPage <= 1}
          data-testid="btn-first-page"
          style={{
            padding: '8px 12px',
            border: '1px solid var(--secondary)',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--white)',
            cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage <= 1 ? 0.5 : 1,
          }}
        >
          First
        </button>
        <button
          type="button"
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage <= 1}
          data-testid="btn-prev-page"
          style={{
            padding: '8px 12px',
            border: '1px solid var(--secondary)',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--white)',
            cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage <= 1 ? 0.5 : 1,
          }}
        >
          Prev
        </button>
        {getPageNumbers().map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onPageChange?.(num)}
            data-testid={`page-number-${num}`}
            style={{
              padding: '8px 12px',
              border: '1px solid var(--secondary)',
              borderRadius: 'var(--radius-sm)',
              background: currentPage === num ? 'var(--primary)' : 'var(--white)',
              color: currentPage === num ? '#fff' : 'var(--text)',
              cursor: 'pointer',
            }}
          >
            {num}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage >= totalPages}
          data-testid="btn-next-page"
          style={{
            padding: '8px 12px',
            border: '1px solid var(--secondary)',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--white)',
            cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
            opacity: currentPage >= totalPages ? 0.5 : 1,
          }}
        >
          Next
        </button>
        <button
          type="button"
          onClick={() => onPageChange?.(totalPages)}
          disabled={currentPage >= totalPages}
          data-testid="btn-last-page"
          style={{
            padding: '8px 12px',
            border: '1px solid var(--secondary)',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--white)',
            cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
            opacity: currentPage >= totalPages ? 0.5 : 1,
          }}
        >
          Last
        </button>
      </div>
    </div>
  );
}
