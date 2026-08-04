
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'hello@smartbestbrands.com'

async function sendEmail(to: string, subject: string, html: string) {
    if (!RESEND_API_KEY) {
        console.warn('RESEND_API_KEY missing. Email not sent:', subject)
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

export async function sendOrderNotification(email: string, orderNumber: string, total: number) {
    const subject = `Smart Best Brands Order ${orderNumber} Confirmed`
    const html = `
        <p>Thank you for your order at Smart Best Brands.</p>
        <p>Your order <strong>${orderNumber}</strong> is now confirmed.</p>
        <p><strong>Total:</strong> ₦${total.toLocaleString()}</p>
        <p>We will notify you when your order is processed and shipped.</p>
        <p>Warm regards,<br/>Smart Best Brands</p>
    `

    return sendEmail(email, subject, html)
}
