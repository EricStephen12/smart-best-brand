const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || ''
const PAYSTACK_VERIFY_URL = 'https://api.paystack.co/transaction/verify'

export interface PaystackVerifyData {
    id: number
    status: string
    reference: string
    amount: number
    currency: string
    paid_at: string | null
    gateway_response: string
    channel: string
    customer: {
        email: string
    }
}

interface PaystackVerifyResponse {
    status: boolean
    message: string
    data?: PaystackVerifyData
}

export function getPaystackSecretKey(): string {
    return PAYSTACK_SECRET
}

export function nairaToKobo(amountNaira: number): number {
    return Math.round(amountNaira * 100)
}

/** Verify a transaction with Paystack's API (server-side only). */
export async function verifyPaystackTransaction(
    reference: string
): Promise<{ success: true; data: PaystackVerifyData } | { success: false; error: string }> {
    if (!PAYSTACK_SECRET) {
        console.error('PAYSTACK_SECRET_KEY is not configured')
        return { success: false, error: 'Payment system not configured' }
    }

    if (!reference || typeof reference !== 'string') {
        return { success: false, error: 'Invalid payment reference' }
    }

    try {
        const response = await fetch(
            `${PAYSTACK_VERIFY_URL}/${encodeURIComponent(reference)}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            }
        )

        if (!response.ok) {
            console.error('Paystack verify HTTP error:', response.status)
            return { success: false, error: 'Unable to verify payment' }
        }

        const payload = (await response.json()) as PaystackVerifyResponse

        if (!payload.status || !payload.data) {
            return { success: false, error: payload.message || 'Payment verification failed' }
        }

        return { success: true, data: payload.data }
    } catch (error) {
        console.error('Paystack verify error:', error)
        return { success: false, error: 'Unable to verify payment' }
    }
}

export function isSuccessfulPaystackCharge(
    data: PaystackVerifyData,
    expectedAmountKobo: number,
    expectedCurrency = 'NGN'
): boolean {
    return (
        data.status === 'success' &&
        data.currency === expectedCurrency &&
        data.amount === expectedAmountKobo
    )
}
