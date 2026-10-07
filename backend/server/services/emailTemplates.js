const brand = {
  name: 'ShopMart',
  color: '#146B45',
  dark: '#1C1917',
  cream: '#F6F3EC',
};

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const layout = (title, body) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;padding:0;background:${brand.cream};font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${brand.cream};padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(26,24,22,0.08);">
        <tr><td style="background:${brand.color};padding:28px 32px;">
          <h1 style="margin:0;color:#fff;font-size:28px;letter-spacing:0.02em;">${brand.name}</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:12px;letter-spacing:0.04em;">Your Neighborhood Superstore</p>
        </td></tr>
        <tr><td style="padding:32px;font-family:Arial,sans-serif;color:${brand.dark};font-size:15px;line-height:1.6;">
          ${body}
        </td></tr>
        <tr><td style="padding:20px 32px;background:#f5f2ec;font-size:12px;color:#6b6560;font-family:Arial,sans-serif;">
          © ${new Date().getFullYear()} ${brand.name}. All rights reserved.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

export const welcomeEmail = (name) =>
  layout(
    'Welcome to ShopMart',
    `
    <h2 style="font-family:Georgia,serif;color:${brand.dark};margin-top:0;">Welcome, ${name}!</h2>
    <p>Thank you for joining <strong>${brand.name}</strong>. Your account is ready — explore our curated collection, save favourites, and enjoy a seamless checkout experience.</p>
    <p style="margin:28px 0;">
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/products" style="display:inline-block;background:${brand.dark};color:#fff;text-decoration:none;padding:14px 28px;border-radius:999px;font-size:13px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;">Start Shopping</a>
    </p>
    <p style="color:#6b6560;font-size:13px;">We're delighted to have you with us.</p>
  `
  );

export const orderConfirmationEmail = ({ name, orderId, items, subtotal, shipping, tax, total, shippingAddress }) => {
  const rows = (items || [])
    .map(
      (i) =>
        `<tr>
          <td style="padding:10px 0;border-bottom:1px solid #e8e4de;">${i.name} × ${i.quantity}</td>
          <td style="padding:10px 0;border-bottom:1px solid #e8e4de;text-align:right;">Rs. ${(i.price * i.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join('');

  const addr = shippingAddress
    ? `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}<br/>
       ${shippingAddress.address || ''}<br/>
       ${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.zipCode || ''}<br/>
       ${shippingAddress.country || ''}`
    : '—';

  return layout(
    'Order Confirmed',
    `
    <h2 style="font-family:Georgia,serif;color:${brand.dark};margin-top:0;">Order confirmed</h2>
    <p>Hi ${name}, we've received your order <strong>#${orderId}</strong> and it's being prepared with care.</p>
    <table width="100%" style="margin:20px 0;font-size:14px;">${rows}</table>
    <table width="100%" style="font-size:14px;margin-bottom:20px;">
      <tr><td>Subtotal</td><td style="text-align:right;">Rs. ${Number(subtotal || 0).toFixed(2)}</td></tr>
      <tr><td>Shipping</td><td style="text-align:right;">Rs. ${Number(shipping || 0).toFixed(2)}</td></tr>
      <tr><td>Tax</td><td style="text-align:right;">Rs. ${Number(tax || 0).toFixed(2)}</td></tr>
      <tr><td style="font-weight:bold;padding-top:8px;">Total</td><td style="text-align:right;font-weight:bold;padding-top:8px;color:${brand.color};">Rs. ${Number(total || 0).toFixed(2)}</td></tr>
    </table>
    <p style="font-size:13px;color:#6b6560;"><strong>Shipping to:</strong><br/>${addr}</p>
    <p style="margin:28px 0;">
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" style="display:inline-block;background:${brand.color};color:#fff;text-decoration:none;padding:14px 28px;border-radius:999px;font-size:13px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;">View Order</a>
    </p>
  `
  );
};

export const contactInboxEmail = ({ name, email, subject, message, messageId, createdAt }) =>
  layout(
    `Contact: ${subject}`,
    `
    <h2 style="font-family:Georgia,serif;color:${brand.dark};margin-top:0;">New contact form message</h2>
    <p style="font-size:13px;color:#6b6560;">Received ${createdAt ? new Date(createdAt).toLocaleString() : 'just now'} · ID ${messageId || '—'}</p>
    <table width="100%" style="font-size:14px;margin:16px 0;">
      <tr><td style="padding:6px 0;color:#6b6560;width:100px;">From</td><td style="padding:6px 0;"><strong>${esc(name)}</strong></td></tr>
      <tr><td style="padding:6px 0;color:#6b6560;">Email</td><td style="padding:6px 0;"><a href="mailto:${esc(email)}" style="color:${brand.color};">${esc(email)}</a></td></tr>
      <tr><td style="padding:6px 0;color:#6b6560;">Subject</td><td style="padding:6px 0;">${esc(subject)}</td></tr>
    </table>
    <div style="background:#f5f2ec;border-radius:12px;padding:16px;font-size:14px;line-height:1.6;white-space:pre-wrap;">${esc(message)}</div>
    <p style="margin:24px 0 0;">
      <a href="mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Re: ${subject}`)}" style="display:inline-block;background:${brand.dark};color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px;font-size:12px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;">Reply to customer</a>
    </p>
  `
  );

export const contactAutoReplyEmail = (name) =>
  layout(
    'We received your message',
    `
    <h2 style="font-family:Georgia,serif;color:${brand.dark};margin-top:0;">Thank you, ${name}!</h2>
    <p>We have received your message and our team will get back to you within 24 hours.</p>
    <p style="color:#6b6560;font-size:13px;">This is an automated confirmation — please do not reply to this email unless you need to add more details.</p>
  `
  );

export const orderDeliveredEmail = ({ name, orderId, total }) =>
  layout(
    'Order Delivered — Thank You',
    `
    <h2 style="font-family:Georgia,serif;color:${brand.dark};margin-top:0;">Delivered with gratitude</h2>
    <p>Hi ${name},</p>
    <p>Your order <strong>#${orderId}</strong> has been delivered. We hope you love every item from your ${brand.name} selection.</p>
    <p style="font-size:18px;color:${brand.color};font-family:Georgia,serif;">Thank you for choosing us.</p>
    <p style="color:#6b6560;font-size:14px;">Order total: <strong>Rs. ${Number(total || 0).toFixed(2)}</strong></p>
    <p style="margin:28px 0;">
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/products" style="display:inline-block;background:${brand.dark};color:#fff;text-decoration:none;padding:14px 28px;border-radius:999px;font-size:13px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;">Shop Again</a>
    </p>
    <p style="color:#6b6560;font-size:13px;">We appreciate your trust and look forward to serving you again.</p>
  `
  );

export const supplierFormEmail = ({ name, email, company, productCategory, city }) =>
  layout(
    'Supplier Application Received',
    `
    <h2 style="font-family:Georgia,serif;color:${brand.dark};margin-top:0;">Thank you for your interest!</h2>
    <p>Hi ${name},</p>
    <p>We have received your supplier application for <strong>${esc(company)}</strong>.</p>
    <table width="100%" style="font-size:14px;margin:16px 0;">
      <tr><td style="padding:6px 0;color:#6b6560;width:100px;">Company</td><td style="padding:6px 0;"><strong>${esc(company)}</strong></td></tr>
      <tr><td style="padding:6px 0;color:#6b6560;">Email</td><td style="padding:6px 0;"><a href="mailto:${esc(email)}" style="color:${brand.color};">${esc(email)}</a></td></tr>
      <tr><td style="padding:6px 0;color:#6b6560;">Category</td><td style="padding:6px 0;">${esc(productCategory)}</td></tr>
      <tr><td style="padding:6px 0;color:#6b6560;">City</td><td style="padding:6px 0;">${esc(city)}</td></tr>
    </table>
    <p>Our team will review your application and contact you within 5-7 business days.</p>
    <p style="color:#6b6560;font-size:13px;">This is an automated confirmation — please do not reply to this email.</p>
  `
  );

export const careerApplicationEmail = ({ name, email, position, city }) =>
  layout(
    'Career Application Received',
    `
    <h2 style="font-family:Georgia,serif;color:${brand.dark};margin-top:0;">Application Received</h2>
    <p>Hi ${name},</p>
    <p>We have received your application for the position of <strong>${esc(position)}</strong>.</p>
    <table width="100%" style="font-size:14px;margin:16px 0;">
      <tr><td style="padding:6px 0;color:#6b6560;width:100px;">Position</td><td style="padding:6px 0;"><strong>${esc(position)}</strong></td></tr>
      <tr><td style="padding:6px 0;color:#6b6560;">Email</td><td style="padding:6px 0;"><a href="mailto:${esc(email)}" style="color:${brand.color};">${esc(email)}</a></td></tr>
      <tr><td style="padding:6px 0;color:#6b6560;">City</td><td style="padding:6px 0;">${esc(city)}</td></tr>
    </table>
    <p>Our HR team will review your application and get back to you if your profile matches our requirements.</p>
    <p style="color:#6b6560;font-size:13px;">This is an automated confirmation — please do not reply to this email.</p>
  `
  );

export const giftCardPurchaseEmail = ({ name, cardNumber, amount, recipientEmail, recipientName }) =>
  layout(
    'Gift Card Purchased',
    `
    <h2 style="font-family:Georgia,serif;color:${brand.dark};margin-top:0;">Gift Card Purchase Successful</h2>
    <p>Hi ${name},</p>
    <p>Your gift card purchase is complete!</p>
    <table width="100%" style="font-size:14px;margin:16px 0;">
      <tr><td style="padding:6px 0;color:#6b6560;width:100px;">Card Number</td><td style="padding:6px 0;"><strong>${esc(cardNumber)}</strong></td></tr>
      <tr><td style="padding:6px 0;color:#6b6560;">Amount</td><td style="padding:6px 0;"><strong>Rs. ${Number(amount).toFixed(2)}</strong></td></tr>
      ${recipientEmail ? `<tr><td style="padding:6px 0;color:#6b6560;">Recipient</td><td style="padding:6px 0;">${esc(recipientName || recipientEmail)}</td></tr>` : ''}
    </table>
    <p>The gift card has been sent to ${recipientEmail ? esc(recipientEmail) : 'your email'}.</p>
    <p style="color:#6b6560;font-size:13px;">This is an automated confirmation — please do not reply to this email.</p>
  `
  );

export const loyaltyPointsEarnedEmail = ({ name, points, newBalance, tier }) =>
  layout(
    'Loyalty Points Earned',
    `
    <h2 style="font-family:Georgia,serif;color:${brand.dark};margin-top:0;">Points Added!</h2>
    <p>Hi ${name},</p>
    <p>You've earned <strong>${points} loyalty points</strong> from your recent purchase!</p>
    <table width="100%" style="font-size:14px;margin:16px 0;">
      <tr><td style="padding:6px 0;color:#6b6560;width:100px;">Points Earned</td><td style="padding:6px 0;"><strong>+${points}</strong></td></tr>
      <tr><td style="padding:6px 0;color:#6b6560;">New Balance</td><td style="padding:6px 0;"><strong>${newBalance} points</strong></td></tr>
      <tr><td style="padding:6px 0;color:#6b6560;">Current Tier</td><td style="padding:6px 0;"><strong>${tier}</strong></td></tr>
    </table>
    <p>Keep shopping to unlock more rewards and tier upgrades!</p>
    <p style="margin:28px 0;">
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/loyalty" style="display:inline-block;background:${brand.color};color:#fff;text-decoration:none;padding:14px 28px;border-radius:999px;font-size:13px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;">View Rewards</a>
    </p>
  `
  );

export const promoCodeAppliedEmail = ({ name, code, discount }) =>
  layout(
    'Promo Code Applied',
    `
    <h2 style="font-family:Georgia,serif;color:${brand.dark};margin-top:0;">Discount Applied!</h2>
    <p>Hi ${name},</p>
    <p>Promo code <strong>${esc(code)}</strong> has been applied to your order.</p>
    <table width="100%" style="font-size:14px;margin:16px 0;">
      <tr><td style="padding:6px 0;color:#6b6560;width:100px;">Promo Code</td><td style="padding:6px 0;"><strong>${esc(code)}</strong></td></tr>
      <tr><td style="padding:6px 0;color:#6b6560;">Discount</td><td style="padding:6px 0;"><strong>Rs. ${Number(discount).toFixed(2)}</strong></td></tr>
    </table>
    <p>Enjoy your savings!</p>
  `
  );

export const loyaltyCardActivatedEmail = ({ name, cardNumber, tier, pointsBalance }) =>
  layout(
    'Loyalty Card Activated',
    `
    <h2 style="font-family:Georgia,serif;color:${brand.dark};margin-top:0;">Your Loyalty Card is Active!</h2>
    <p>Hi ${name},</p>
    <p>Your loyalty card has been successfully activated. You can now start earning and redeeming points on every purchase!</p>
    <table width="100%" style="font-size:14px;margin:16px 0;">
      <tr><td style="padding:6px 0;color:#6b6560;width:100px;">Card Number</td><td style="padding:6px 0;"><strong>${esc(cardNumber)}</strong></td></tr>
      <tr><td style="padding:6px 0;color:#6b6560;">Current Tier</td><td style="padding:6px 0;"><strong>${tier}</strong></td></tr>
      <tr><td style="padding:6px 0;color:#6b6560;">Points Balance</td><td style="padding:6px 0;"><strong>${pointsBalance} points</strong></td></tr>
    </table>
    <p>Start shopping to earn more points and unlock exclusive rewards!</p>
    <p style="margin:28px 0;">
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/loyalty" style="display:inline-block;background:${brand.color};color:#fff;text-decoration:none;padding:14px 28px;border-radius:999px;font-size:13px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;">View Rewards Program</a>
    </p>
  `
  );
