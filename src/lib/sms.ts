
export async function sendSMS(to: string, message: string) {
    const apiKey = process.env.TERMII_API_KEY;
    const senderId = process.env.TERMII_SENDER_ID || 'SmartBrand';

    if (!apiKey) {
        console.warn('TERMII_API_KEY missing. SMS not sent:', message);
        return { success: false, error: 'Configuration missing' };
    }

    try {
        const response = await fetch('https://api.ng.termii.com/api/sms/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to,
                from: senderId,
                sms: message,
                type: 'plain',
                channel: 'dnd',
                api_key: apiKey,
            }),
        });

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error('Termii SMS Error:', error);
        return { success: false, error };
    }
}

export async function sendOrderNotification(phone: string, orderNumber: string, total: number) {
    const message = `Your elite curation ${orderNumber} for ₦${total.toLocaleString()} has been received. Our concierge team is now processing your request. - Smart Best Brands`;
    return sendSMS(phone, message);
}
