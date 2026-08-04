const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || ''
const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET || ''

export async function sendN8nEvent(event: string, data: Record<string, any>) {
    if (!N8N_WEBHOOK_URL) {
        console.warn('N8N_WEBHOOK_URL is not configured. Skipping event:', event)
        return { success: false, error: 'N8N webhook not configured' }
    }

    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(N8N_WEBHOOK_SECRET ? { 'x-n8n-secret': N8N_WEBHOOK_SECRET } : {})
            },
            body: JSON.stringify({ event, data })
        })

        const payload = await response.text()
        return { success: response.ok, status: response.status, payload }
    } catch (error) {
        console.error('Failed to send event to n8n:', event, error)
        return { success: false, error }
    }
}
