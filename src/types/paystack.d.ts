interface PaystackPopHandler {
    openIframe: () => void
}

interface PaystackPopSetupOptions {
    key: string
    email: string
    amount: number
    reference: string
    currency?: string
    callback?: (response: { reference: string; status?: string; trans?: string; transaction?: string }) => void
    onClose?: () => void
}

interface PaystackPop {
    setup: (options: PaystackPopSetupOptions) => PaystackPopHandler
}

interface Window {
    PaystackPop: PaystackPop
}
