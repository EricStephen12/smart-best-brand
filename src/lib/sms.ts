const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'orders@smartbestbrands.com'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://smartbestbrands.com'

export interface OrderItemEmail {
    name: string
    size?: string | null
    quantity: number
    price: number
}

export interface OrderEmailData {
    orderNumber: string
    customerName: string
    customerEmail: string
    customerPhone?: string | null
    deliveryAddress: string
    deliveryLocation: string
    deliveryFee?: number
    subtotal?: number
    discount?: number
    total: number
    paymentMethod: string
    status: string
    items: OrderItemEmail[]
}

export interface OrderStatusEmailData {
    orderNumber: string
    customerName: string
    customerEmail: string
    status: string
    deliveryAddress?: string
    deliveryLocation?: string
    total?: number
    trackingNote?: string
}

export async function sendEmail(to: string, subject: string, html: string) {
    if (!RESEND_API_KEY) {
        console.warn('RESEND_API_KEY missing. Email logged to console:', { to, subject })
        return { success: false, error: 'Configuration missing' }
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: RESEND_FROM_EMAIL,
                to,
                subject,
                html
            })
        })

        const data = await response.json()
        return { success: response.ok, data }
    } catch (error) {
        console.error('Resend email error:', error)
        return { success: false, error }
    }
}

/**
 * Common HTML container for Smart Best Brands emails
 */
function emailLayout(content: string, previewText?: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Best Brands</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0b192c; -webkit-font-smoothing: antialiased;">
    ${previewText ? `<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">${previewText}</div>` : ''}
    <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(11, 25, 44, 0.04);">
        <!-- Brand Header -->
        <div style="background-color: #0b192c; padding: 24px 32px; text-align: center;">
            <p style="margin: 0; font-size: 11px; font-weight: 800; letter-spacing: 0.25em; text-transform: uppercase; color: #38bdf8;">Authentic Home & Comfort</p>
            <h1 style="margin: 6px 0 0 0; font-size: 22px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #ffffff;">Smart Best Brands</h1>
        </div>

        <!-- Body Content -->
        <div style="padding: 32px 28px;">
            ${content}
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px; text-align: center; font-size: 12px; color: #64748b; line-height: 1.6;">
            <p style="margin: 0 0 8px 0; font-weight: 600; color: #0b192c;">Smart Best Brands Nigeria</p>
            <p style="margin: 0 0 12px 0;">Official distributor of premium Mouka, Vitafoam, Royal mattresses & luxury furniture.</p>
            <p style="margin: 0;">Need assistance? Reply directly to this email or chat with our concierge.</p>
        </div>
    </div>
</body>
</html>
`
}

/**
 * 1. Customer Order Confirmation Receipt
 */
export async function sendCustomerOrderReceipt(order: OrderEmailData) {
    const isBankTransfer = order.paymentMethod.toUpperCase() === 'BANK_TRANSFER'
    const isWhatsApp = order.paymentMethod.toUpperCase() === 'WHATSAPP'
    const isPaid = order.status.toUpperCase() === 'PAID'

    const statusBadgeText = isPaid
        ? 'Payment Confirmed'
        : isBankTransfer
        ? 'Awaiting Bank Transfer'
        : isWhatsApp
        ? 'Order Reserved (WhatsApp)'
        : 'Order Received'

    const statusBadgeColor = isPaid
        ? '#059669'
        : isBankTransfer
        ? '#0284c7'
        : '#d97706'

    const itemsRows = order.items
        .map(
            (item) => `
        <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                <p style="margin: 0; font-weight: 600; font-size: 14px; color: #0b192c;">${item.name}</p>
                ${item.size ? `<p style="margin: 2px 0 0 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Size: ${item.size}</p>` : ''}
            </td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f1f5f9; text-align: center; font-size: 13px; color: #64748b;">
                ×${item.quantity}
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 600; font-size: 14px; color: #0b192c;">
                ₦${(item.price * item.quantity).toLocaleString()}
            </td>
        </tr>`
        )
        .join('')

    const bankTransferBox = isBankTransfer
        ? `
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 18px; margin: 24px 0;">
            <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: #15803d;">
                Bank Transfer Instructions
            </p>
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #166534; line-height: 1.5;">
                Please transfer your order total to our corporate account to initiate dispatch:
            </p>
            <table style="width: 100%; font-size: 13px; color: #166534;">
                <tr><td style="padding: 3px 0; width: 120px;"><strong>Bank:</strong></td><td>Moniepoint MFB / Zenith Bank</td></tr>
                <tr><td style="padding: 3px 0;"><strong>Account Name:</strong></td><td>Smart Best Brands Nigeria</td></tr>
                <tr><td style="padding: 3px 0;"><strong>Account Number:</strong></td><td><strong style="font-size: 15px; font-family: monospace; background: #ffffff; padding: 2px 6px; border: 1px solid #86efac;">08064619479</strong></td></tr>
                <tr><td style="padding: 3px 0;"><strong>Transfer Narration:</strong></td><td><strong style="color: #0b192c; font-family: monospace;">${order.orderNumber}</strong></td></tr>
            </table>
            <p style="margin: 10px 0 0 0; font-size: 11px; color: #15803d;">
                * Always include your Order Reference <strong>${order.orderNumber}</strong> as transfer narration for instant verification.
            </p>
        </div>`
        : ''

    const content = `
        <div style="text-align: center; margin-bottom: 24px;">
            <span style="display: inline-block; padding: 4px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; border-radius: 20px; background-color: ${statusBadgeColor}15; color: ${statusBadgeColor};">
                ${statusBadgeText}
            </span>
            <h2 style="margin: 12px 0 6px 0; font-size: 22px; font-weight: 700; color: #0b192c;">Thank you for your order</h2>
            <p style="margin: 0; font-size: 14px; color: #64748b;">
                Order Reference: <strong style="color: #0b192c; font-family: monospace;">${order.orderNumber}</strong>
            </p>
        </div>

        <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
            Hello <strong>${order.customerName}</strong>,<br/>
            We have received your order. Below is a complete summary of your items and delivery destination.
        </p>

        ${bankTransferBox}

        <h3 style="margin: 24px 0 8px 0; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: #64748b;">
            Order Items
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
            <tbody>
                ${itemsRows}
            </tbody>
        </table>

        <div style="margin-top: 16px; padding-top: 12px; border-top: 2px solid #0b192c;">
            ${order.subtotal ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; color: #64748b;">
                <span>Subtotal:</span>
                <span style="color: #0b192c; font-weight: 600;">₦${order.subtotal.toLocaleString()}</span>
            </div>` : ''}
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; color: #64748b;">
                <span>Delivery (${order.deliveryLocation}):</span>
                <span style="color: #0b192c; font-weight: 600;">${order.deliveryFee ? `₦${order.deliveryFee.toLocaleString()}` : 'Standard Delivery'}</span>
            </div>
            ${order.discount ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; color: #0284c7;">
                <span>Discount:</span>
                <span>-₦${order.discount.toLocaleString()}</span>
            </div>` : ''}
            <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #e2e8f0; font-size: 16px; font-weight: 700; color: #0b192c;">
                <span>Total Amount:</span>
                <span style="color: #0b192c;">₦${order.total.toLocaleString()}</span>
            </div>
        </div>

        <div style="margin-top: 28px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px;">
            <h4 style="margin: 0 0 6px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: #64748b;">Delivery Destination</h4>
            <p style="margin: 0; font-size: 13px; color: #0b192c; line-height: 1.5;">
                <strong>${order.customerName}</strong> (${order.customerPhone || 'Phone on file'})<br/>
                ${order.deliveryAddress}<br/>
                ${order.deliveryLocation}
            </p>
        </div>

        <div style="margin-top: 28px; text-align: center;">
            <a href="${APP_URL}/account/orders" style="display: inline-block; background-color: #0b192c; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 14px 28px; border-radius: 4px;">
                View Order In Portal
            </a>
        </div>
    `

    const subject = `Your Smart Best Brands Order Receipt [${order.orderNumber}]`
    return sendEmail(order.customerEmail, subject, emailLayout(content, `Order confirmation for ${order.orderNumber}`))
}

/**
 * 2. Customer Order Payment Confirmed Receipt
 */
export async function sendCustomerPaymentSuccessEmail(order: OrderEmailData) {
    const content = `
        <div style="text-align: center; margin-bottom: 24px;">
            <span style="display: inline-block; padding: 4px 14px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.18em; border-radius: 20px; background-color: #dcfce7; color: #15803d;">
                ✓ Payment Received & Verified
            </span>
            <h2 style="margin: 14px 0 6px 0; font-size: 24px; font-weight: 700; color: #0b192c;">Payment Confirmed</h2>
            <p style="margin: 0; font-size: 14px; color: #64748b;">
                Order Reference: <strong style="color: #0b192c; font-family: monospace;">${order.orderNumber}</strong>
            </p>
        </div>

        <p style="font-size: 14px; color: #334155; line-height: 1.6;">
            Hello <strong>${order.customerName}</strong>,<br/>
            We have successfully received your payment of <strong style="color: #0b192c;">₦${order.total.toLocaleString()}</strong>.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 18px; margin: 20px 0;">
            <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #0b192c;">What happens next?</p>
            <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.6;">
                Your items have been allocated and routed to our logistics desk. You will receive an automated email as soon as your order is dispatched with delivery contact details.
            </p>
        </div>

        <div style="margin-top: 24px; text-align: center;">
            <a href="${APP_URL}/account/orders" style="display: inline-block; background-color: #0b192c; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 14px 28px; border-radius: 4px;">
                Track Delivery Status
            </a>
        </div>
    `

    const subject = `Payment Confirmed: Order ${order.orderNumber} - Smart Best Brands`
    return sendEmail(order.customerEmail, subject, emailLayout(content, `Payment of ₦${order.total.toLocaleString()} confirmed for order ${order.orderNumber}`))
}

/**
 * 3. Customer Order Status Update Email (Processing, Shipped, Delivered, Cancelled)
 */
export async function sendOrderStatusUpdateEmail(data: OrderStatusEmailData) {
    const status = data.status.toUpperCase()
    let statusTitle = `Order Update: ${status}`
    let statusColor = '#0284c7'
    let statusMessage = 'There is an update on your Smart Best Brands order.'
    let subject = `Update on Order ${data.orderNumber} - Smart Best Brands`
    switch (status) {
        case 'PAID':
            statusTitle = 'Payment Confirmed'
            statusColor = '#059669'
            statusMessage = 'Your payment has been successfully verified and confirmed. Your order is now queued for packaging and fulfillment.'
            subject = `Payment Confirmed for Order ${data.orderNumber} - Smart Best Brands`
            break
        case 'PROCESSING':
            statusTitle = 'Order is Processing'
            statusColor = '#0284c7'
            statusMessage = 'Your order has been confirmed and our warehouse is currently preparing, inspecting, and packaging your pieces for dispatch.'
            subject = `Your Order ${data.orderNumber} is Being Prepared`
            break
        case 'SHIPPED':
            statusTitle = 'Order Dispatched & On the Way'
            statusColor = '#7c3aed'
            statusMessage = 'Great news! Your order has departed our facility and is en route to your specified address. Our delivery personnel will contact you upon arrival.'
            subject = `Your Order ${data.orderNumber} has Been Dispatched 🚚`
            break
        case 'DELIVERED':
            statusTitle = 'Order Successfully Delivered'
            statusColor = '#059669'
            statusMessage = 'Your order has been delivered! We hope you thoroughly enjoy the comfort and restful sleep of your new pieces. If you have any inquiries or warranty questions, our concierge is here to assist.'
            subject = `Delivered: Your Order ${data.orderNumber} ✨`
            break
        case 'CANCELLED':
            statusTitle = 'Order Cancelled'
            statusColor = '#e11d48'
            statusMessage = 'Your order has been cancelled. If this was unexpected or you would like to reinstate your order, please contact our support team.'
            subject = `Notice Regarding Order ${data.orderNumber}`
            break
    }

    const content = `
        <div style="text-align: center; margin-bottom: 24px;">
            <span style="display: inline-block; padding: 4px 14px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.18em; border-radius: 20px; background-color: ${statusColor}15; color: ${statusColor};">
                ${statusTitle}
            </span>
            <h2 style="margin: 14px 0 6px 0; font-size: 24px; font-weight: 700; color: #0b192c;">${statusTitle}</h2>
            <p style="margin: 0; font-size: 14px; color: #64748b;">
                Order Reference: <strong style="color: #0b192c; font-family: monospace;">${data.orderNumber}</strong>
            </p>
        </div>

        <p style="font-size: 14px; color: #334155; line-height: 1.6;">
            Hello <strong>${data.customerName}</strong>,<br/>
            ${statusMessage}
        </p>

        ${data.trackingNote ? `
        <div style="background-color: #f8fafc; border-left: 3px solid ${statusColor}; padding: 14px 16px; margin: 20px 0;">
            <p style="margin: 0; font-size: 13px; color: #334155; line-height: 1.5;">
                <strong>Note:</strong> ${data.trackingNote}
            </p>
        </div>` : ''}

        ${data.deliveryAddress ? `
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-top: 20px;">
            <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: #64748b;">Destination</p>
            <p style="margin: 0; font-size: 13px; color: #0b192c;">
                ${data.deliveryAddress}${data.deliveryLocation ? `, ${data.deliveryLocation}` : ''}
            </p>
        </div>` : ''}

        <div style="margin-top: 28px; text-align: center;">
            <a href="${APP_URL}/account/orders" style="display: inline-block; background-color: #0b192c; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 14px 28px; border-radius: 4px;">
                View Order Details
            </a>
        </div>
    `

    return sendEmail(data.customerEmail, subject, emailLayout(content, statusMessage))
}

/**
 * 4. Direct Admin Order Alert
 */
export async function sendAdminOrderAlert(order: OrderEmailData) {
    const notifyTo = process.env.ADMIN_NOTIFY_EMAIL || process.env.CONTACT_NOTIFY_EMAIL || process.env.RESEND_FROM_EMAIL
    if (!notifyTo) {
        console.warn('No ADMIN_NOTIFY_EMAIL / CONTACT_NOTIFY_EMAIL configured for admin order alert')
        return { success: false, error: 'Notify email not configured' }
    }

    const itemsHtml = order.items
        .map(
            (i) =>
                `<tr>
                    <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0;">${i.name} ${i.size ? `(${i.size})` : ''}</td>
                    <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">${i.quantity}</td>
                    <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">₦${(i.price * i.quantity).toLocaleString()}</td>
                </tr>`
        )
        .join('')

    const content = `
        <h2 style="margin: 0 0 6px 0; font-size: 20px; font-weight: 700; color: #0b192c;">New Order Received</h2>
        <p style="margin: 0 0 20px 0; font-size: 13px; color: #64748b;">Order Reference: <strong>${order.orderNumber}</strong></p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px; font-size: 13px;">
            <p style="margin: 4px 0;"><strong>Customer:</strong> ${order.customerName}</p>
            <p style="margin: 4px 0;"><strong>Phone:</strong> ${order.customerPhone || 'N/A'}</p>
            <p style="margin: 4px 0;"><strong>Email:</strong> ${order.customerEmail}</p>
            <p style="margin: 4px 0;"><strong>Location:</strong> ${order.deliveryLocation}</p>
            <p style="margin: 4px 0;"><strong>Address:</strong> ${order.deliveryAddress}</p>
            <p style="margin: 4px 0;"><strong>Payment Method:</strong> ${order.paymentMethod} (${order.status})</p>
            <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: 700; color: #0b192c;"><strong>Total:</strong> ₦${order.total.toLocaleString()}</p>
        </div>

        <h3 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-bottom: 10px;">Ordered Items:</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
                <tr style="background-color: #f1f5f9; text-align: left;">
                    <th style="padding: 8px 12px;">Product</th>
                    <th style="padding: 8px 12px; text-align: center;">Qty</th>
                    <th style="padding: 8px 12px; text-align: right;">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
            </tbody>
        </table>

        <div style="margin-top: 24px; text-align: center;">
            <a href="${APP_URL}/account/orders" style="display: inline-block; background-color: #0b192c; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 12px 24px; border-radius: 4px;">
                Open Admin Orders Desk
            </a>
        </div>
    `

    const subject = `[NEW ORDER] ${order.orderNumber} - ₦${order.total.toLocaleString()} (${order.paymentMethod})`
    return sendEmail(notifyTo, subject, emailLayout(content))
}

/**
 * 5. Direct Admin Payment Alert
 */
export async function sendAdminPaymentAlert(order: { orderNumber: string; customerName: string; total: number; paymentMethod: string }) {
    const notifyTo = process.env.ADMIN_NOTIFY_EMAIL || process.env.CONTACT_NOTIFY_EMAIL || process.env.RESEND_FROM_EMAIL
    if (!notifyTo) return { success: false, error: 'Notify email not configured' }

    const content = `
        <div style="background-color: #dcfce7; border: 1px solid #86efac; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
            <h2 style="margin: 0 0 6px 0; font-size: 18px; font-weight: 700; color: #15803d;">Payment Verified & Paid</h2>
            <p style="margin: 0; font-size: 13px; color: #166534;">Order: <strong>${order.orderNumber}</strong> has been marked PAID.</p>
        </div>
        <p style="font-size: 14px; color: #0b192c;">
            <strong>Customer:</strong> ${order.customerName}<br/>
            <strong>Amount:</strong> ₦${order.total.toLocaleString()}<br/>
            <strong>Method:</strong> ${order.paymentMethod}
        </p>
        <p style="font-size: 13px; color: #64748b;">Inventory has been decremented automatically. You can now prepare this order for shipping.</p>
    `

    const subject = `[PAID] Order ${order.orderNumber} - ₦${order.total.toLocaleString()}`
    return sendEmail(notifyTo, subject, emailLayout(content))
}

/**
 * 6. Contact Form Notification
 */
export async function sendContactInquiryNotification(inquiry: {
    name: string
    phone: string
    email: string | null
    subject: string
    message: string
}) {
    const notifyTo = process.env.CONTACT_NOTIFY_EMAIL || process.env.RESEND_FROM_EMAIL
    if (!notifyTo) {
        console.warn('No CONTACT_NOTIFY_EMAIL / RESEND_FROM_EMAIL for contact inquiries')
        return { success: false, error: 'Notify email not configured' }
    }

    const content = `
        <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #0b192c;">New Contact Form Message</h2>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; font-size: 13px;">
            <p style="margin: 4px 0;"><strong>Name:</strong> ${inquiry.name}</p>
            <p style="margin: 4px 0;"><strong>Phone:</strong> ${inquiry.phone}</p>
            <p style="margin: 4px 0;"><strong>Email:</strong> ${inquiry.email || '—'}</p>
            <p style="margin: 4px 0;"><strong>Subject:</strong> ${inquiry.subject}</p>
        </div>
        <div style="margin-top: 16px; padding: 16px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px;">
            <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b;">Message:</p>
            <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-line;">${inquiry.message}</p>
        </div>
    `

    const subject = `Contact inquiry: ${inquiry.subject}`
    return sendEmail(notifyTo, subject, emailLayout(content))
}

/**
 * 7. Password Reset Email
 */
export async function sendPasswordResetEmail(email: string, resetUrl: string) {
    const content = `
        <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #0b192c;">Password Reset Request</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
            We received a request to reset the password for your Smart Best Brands account. Click the button below to choose a new password:
        </p>
        <div style="margin: 28px 0; text-align: center;">
            <a href="${resetUrl}" style="background-color: #0b192c; color: #ffffff; padding: 14px 28px; border-radius: 4px; font-size: 13px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; display: inline-block;">
                Reset Password
            </a>
        </div>
        <p style="font-size: 12px; line-height: 1.5; color: #94a3b8;">
            This link will expire in 1 hour. If you did not make this request, you can safely ignore this email — your password will remain unchanged.
        </p>
    `

    console.log(`[AUTH] Password reset link for ${email}: ${resetUrl}`)
    const subject = 'Reset your password - Smart Best Brands'
    return sendEmail(email, subject, emailLayout(content, 'Reset your Smart Best Brands password'))
}

/**
 * Legacy compatibility wrapper for sendOrderNotification
 */
export async function sendOrderNotification(email: string, orderNumber: string, total: number) {
    return sendCustomerOrderReceipt({
        orderNumber,
        customerName: 'Valued Client',
        customerEmail: email,
        deliveryAddress: 'Delivery address on file',
        deliveryLocation: 'Nigeria',
        total,
        paymentMethod: 'ONLINE',
        status: 'PAID',
        items: []
    })
}
