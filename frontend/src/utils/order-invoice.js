const formatOrderId = (order) => {
  const id = order?.orderId || order?.id || order?._id;
  return id ? `#${String(id)}` : '#------';
};

const formatMoney = (value) => `PKR ${Number(value || 0).toFixed(2)}`;

const formatPaymentMethod = (method) => {
  if (!method) return 'N/A';
  if (method === 'cod') return 'Cash on Delivery';
  return String(method).replace(/_/g, ' ');
};

const formatOrderDate = (order) => {
  const raw = order?.createdAt || order?.date;
  if (!raw) return '—';
  try {
    return new Intl.DateTimeFormat('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(raw));
  } catch {
    return String(raw);
  }
};

const buildInvoiceHtml = (order) => {
  const orderId = formatOrderId(order);
  const items = order?.items || [];
  const shipping = order?.shipping || {};
  const customerName = [shipping.firstName, shipping.lastName].filter(Boolean).join(' ')
    || order?.userName
    || 'Customer';
  const email = order?.guestEmail || shipping.email || '—';
  const phone = shipping.phone || '—';
  const address = [shipping.address, shipping.city, shipping.state, shipping.zipCode, shipping.country]
    .filter(Boolean)
    .join(', ') || '—';

  const itemRows = items.length
    ? items
        .map(
          (item) => `
            <tr>
              <td style="padding:10px 8px;border-bottom:1px solid #e8eee9;">${item.name || 'Item'}</td>
              <td style="padding:10px 8px;border-bottom:1px solid #e8eee9;text-align:center;">${item.quantity || 1}</td>
              <td style="padding:10px 8px;border-bottom:1px solid #e8eee9;text-align:right;">${formatMoney(item.price)}</td>
              <td style="padding:10px 8px;border-bottom:1px solid #e8eee9;text-align:right;">${formatMoney((item.price || 0) * (item.quantity || 1))}</td>
            </tr>`
        )
        .join('')
    : '<tr><td colspan="4" style="padding:12px;text-align:center;color:#666;">No items</td></tr>';

  return `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:720px;margin:0 auto;padding:28px;color:#1a1a1a;background:#fff;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;border-bottom:3px solid #007a3d;padding-bottom:16px;margin-bottom:20px;">
        <div>
          <h1 style="margin:0;color:#007a3d;font-size:28px;letter-spacing:0.02em;">ShopMart</h1>
          <p style="margin:6px 0 0;color:#666;font-size:13px;">Invoice / Payment Receipt</p>
        </div>
        <div style="text-align:right;font-size:13px;line-height:1.6;">
          <p style="margin:0;"><strong>Invoice</strong> ${orderId}</p>
          <p style="margin:0;">Date: ${formatOrderDate(order)}</p>
          <p style="margin:0;">Status: ${order?.status || 'processing'}</p>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:22px;font-size:13px;">
        <div style="background:#f4f8f5;border-radius:10px;padding:14px;">
          <p style="margin:0 0 8px;font-weight:700;color:#007a3d;text-transform:uppercase;font-size:11px;letter-spacing:0.08em;">Bill To</p>
          <p style="margin:0 0 4px;"><strong>${customerName}</strong></p>
          <p style="margin:0 0 4px;">${email}</p>
          <p style="margin:0 0 4px;">${phone}</p>
          <p style="margin:0;">${address}</p>
        </div>
        <div style="background:#fff7f0;border-radius:10px;padding:14px;">
          <p style="margin:0 0 8px;font-weight:700;color:#e85d04;text-transform:uppercase;font-size:11px;letter-spacing:0.08em;">Payment</p>
          <p style="margin:0 0 4px;">Method: ${formatPaymentMethod(order?.paymentMethod)}</p>
          <p style="margin:0 0 4px;">Subtotal: ${formatMoney(order?.subtotal ?? order?.total)}</p>
          <p style="margin:0 0 4px;">Discount: ${formatMoney(order?.discount)}</p>
          <p style="margin:0 0 4px;">Shipping: ${formatMoney(order?.shippingCost)}</p>
          <p style="margin:0 0 4px;">Tax: ${formatMoney(order?.tax)}</p>
          <p style="margin:8px 0 0;font-size:16px;"><strong>Total: ${formatMoney(order?.total)}</strong></p>
        </div>
      </div>

      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px;">
        <thead>
          <tr style="background:#007a3d;color:#fff;">
            <th style="text-align:left;padding:10px 8px;">Item</th>
            <th style="text-align:center;padding:10px 8px;">Qty</th>
            <th style="text-align:right;padding:10px 8px;">Price</th>
            <th style="text-align:right;padding:10px 8px;">Amount</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <div style="border-top:1px solid #e8eee9;padding-top:16px;text-align:center;color:#666;font-size:12px;">
        <p style="margin:0 0 4px;">Thank you for shopping with ShopMart!</p>
        <p style="margin:0;">Keep this invoice for your records.</p>
      </div>
    </div>
  `;
};

export const printOrderInvoice = (order) => {
  if (!order) return;

  const printable = document.getElementById('order-invoice-print');
  if (printable) {
    window.print();
    return;
  }

  const frame = document.createElement('iframe');
  frame.style.position = 'fixed';
  frame.style.right = '0';
  frame.style.bottom = '0';
  frame.style.width = '0';
  frame.style.height = '0';
  frame.style.border = '0';
  document.body.appendChild(frame);

  const doc = frame.contentDocument || frame.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(frame);
    return;
  }

  doc.open();
  doc.write(`<!DOCTYPE html><html><head><title>Invoice ${formatOrderId(order)}</title></head><body>${buildInvoiceHtml(order)}</body></html>`);
  doc.close();

  frame.contentWindow?.focus();
  frame.contentWindow?.print();
  setTimeout(() => {
    if (frame.parentNode) document.body.removeChild(frame);
  }, 1000);
};

export const downloadOrderInvoicePdf = async (order) => {
  if (!order) {
    throw new Error('Order is required');
  }

  const html2pdf = (await import('html2pdf.js')).default;
  const element = document.createElement('div');
  element.innerHTML = buildInvoiceHtml(order);
  element.style.position = 'fixed';
  element.style.left = '-9999px';
  element.style.top = '0';
  document.body.appendChild(element);

  const options = {
    margin: 10,
    filename: `ShopMart_Invoice_${formatOrderId(order).replace('#', '')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  try {
    await html2pdf().set(options).from(element).save();
  } finally {
    if (element.parentNode) document.body.removeChild(element);
  }
};

export { formatOrderId, formatMoney, formatPaymentMethod, formatOrderDate, buildInvoiceHtml };
