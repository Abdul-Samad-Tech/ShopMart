import nodemailer from 'nodemailer';
import {
  welcomeEmail,
  orderConfirmationEmail,
  orderDeliveredEmail,
  contactInboxEmail,
  contactAutoReplyEmail,
  supplierFormEmail,
  careerApplicationEmail,
  giftCardPurchaseEmail,
  loyaltyPointsEarnedEmail,
  promoCodeAppliedEmail,
  loyaltyCardActivatedEmail,
} from './emailTemplates.js';
import SiteContent from '../models/SiteContent.js';

let transporter = null;

export const isMailConfigured = () => Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

const getTransporter = () => {
  if (!isMailConfigured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
};

export async function sendEmail({ to, subject, html, replyTo }) {
  const transport = getTransporter();
  if (!transport) {
    console.warn(`[mail] SMTP not configured — skipped: "${subject}" → ${to}`);
    return { skipped: true };
  }
  try {
    const info = await transport.sendMail({
      from: process.env.MAIL_FROM || `ShopMart <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      replyTo,
    });
    console.log(`[mail] Sent "${subject}" → ${to} (${info.messageId})`);
    return info;
  } catch (err) {
    console.error(`[mail] Failed "${subject}" → ${to}:`, err.message);
    throw err;
  }
};

/** Fire-and-forget — never blocks API responses */
export function sendEmailAsync(payload) {
  sendEmail(payload).catch((err) => console.error('[mail] async error:', err.message));
}

export function sendWelcomeEmail(user) {
  if (!user?.email) return;
  sendEmailAsync({
    to: user.email,
    subject: `Welcome to ShopMart, ${user.name?.split(' ')[0] || 'there'}!`,
    html: welcomeEmail(user.name),
  });
}

export function sendOrderConfirmationEmail(user, order) {
  const email = user?.email || order?.guestEmail || order?.shipping?.email;
  if (!email || !order) return;
  const orderId = order.id || order._id?.toString()?.slice(-6)?.toUpperCase();
  const name =
    user?.name ||
    [order.shipping?.firstName, order.shipping?.lastName].filter(Boolean).join(' ') ||
    'Customer';
  sendEmailAsync({
    to: email,
    subject: `Order confirmed — #${orderId}`,
    html: orderConfirmationEmail({
      name,
      orderId,
      items: order.items,
      subtotal: order.subtotal,
      shipping: order.shippingCost ?? 0,
      tax: order.tax,
      total: order.total,
      shippingAddress: order.shipping,
    }),
  });
}

export function sendOrderDeliveredEmail(user, order) {
  if (!user?.email || !order) return;
  const orderId = order.id || order._id?.toString()?.slice(-6)?.toUpperCase();
  sendEmailAsync({
    to: user.email,
    subject: `Delivered — thank you! Order #${orderId}`,
    html: orderDeliveredEmail({
      name: user.name,
      orderId,
      total: order.total,
    }),
  });
}

export function getAdminInboxEmail() {
  return (
    process.env.ADMIN_EMAIL ||
    process.env.CONTACT_INBOX ||
    process.env.SMTP_USER ||
    ''
  );
}

export async function sendContactNotificationEmail(contactMessage) {
  const inbox = getAdminInboxEmail();
  if (!inbox) {
    console.warn('[mail] No ADMIN_EMAIL, CONTACT_INBOX, or SMTP_USER — contact email skipped');
    return { skipped: true };
  }

  let ccSite = null;
  try {
    const site = await SiteContent.findOne({ key: 'main' }).select('contact.emails').lean();
    ccSite = site?.contact?.emails?.[0];
  } catch {
    /* ignore */
  }

  const html = contactInboxEmail({
    name: contactMessage.name,
    email: contactMessage.email,
    subject: contactMessage.subject,
    message: contactMessage.message,
    messageId: contactMessage._id?.toString()?.slice(-6)?.toUpperCase(),
    createdAt: contactMessage.createdAt,
  });

  const result = await sendEmail({
    to: inbox,
    subject: `[ShopMart Contact] ${contactMessage.subject}`,
    html,
    replyTo: contactMessage.email,
  });

  sendEmailAsync({
    to: contactMessage.email,
    subject: 'We received your message — ShopMart',
    html: contactAutoReplyEmail(contactMessage.name),
  });

  if (ccSite && ccSite !== inbox) {
    sendEmailAsync({
      to: ccSite,
      subject: `[ShopMart Contact] ${contactMessage.subject}`,
      html,
      replyTo: contactMessage.email,
    });
  }

  return result;
}

export async function verifyMailConnection() {
  const transport = getTransporter();
  if (!transport) return false;
  try {
    await transport.verify();
    console.log('[mail] SMTP connection verified');
    return true;
  } catch (err) {
    console.warn('[mail] SMTP verify failed:', err.message);
    return false;
  }
}

export function sendSupplierFormEmail(data) {
  if (!data?.email) return;
  sendEmailAsync({
    to: data.email,
    subject: 'Supplier Application Received — ShopMart',
    html: supplierFormEmail(data),
  });
}

export function sendCareerApplicationEmail(data) {
  if (!data?.email) return;
  sendEmailAsync({
    to: data.email,
    subject: 'Career Application Received — ShopMart',
    html: careerApplicationEmail(data),
  });
}

export function sendGiftCardPurchaseEmail(data) {
  if (!data?.email) return;
  sendEmailAsync({
    to: data.email,
    subject: 'Gift Card Purchased — ShopMart',
    html: giftCardPurchaseEmail(data),
  });
}

export function sendLoyaltyPointsEarnedEmail(data) {
  if (!data?.email) return;
  sendEmailAsync({
    to: data.email,
    subject: 'Loyalty Points Earned — ShopMart',
    html: loyaltyPointsEarnedEmail(data),
  });
}

export function sendPromoCodeAppliedEmail(data) {
  if (!data?.email) return;
  sendEmailAsync({
    to: data.email,
    subject: 'Promo Code Applied — ShopMart',
    html: promoCodeAppliedEmail(data),
  });
}

export function sendLoyaltyCardActivatedEmail(data) {
  if (!data?.email) return;
  sendEmailAsync({
    to: data.email,
    subject: 'Loyalty Card Activated — ShopMart',
    html: loyaltyCardActivatedEmail(data),
  });
}

export function sendOTPEmail(email, otp) {
  if (!email) return;
  const otpHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset OTP</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp { font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 5px; text-align: center; margin: 20px 0; padding: 20px; background: white; border-radius: 10px; border: 2px dashed #667eea; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>You requested to reset your password. Use the following OTP to verify your identity:</p>
          <div class="otp">${otp}</div>
          <p><strong>This OTP will expire in 10 minutes.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>For your security, please do not share this OTP with anyone.</p>
        </div>
        <div class="footer">
          <p>&copy; 2026 ShopMart. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  sendEmailAsync({
    to: email,
    subject: 'Password Reset OTP — ShopMart',
    html: otpHtml,
  });
}
