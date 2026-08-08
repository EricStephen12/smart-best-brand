'use server'

import prisma from '@/lib/prisma'
import { sendContactInquiryNotification } from '@/lib/sms'

export async function submitContactInquiry(data: {
    name: string
    phone: string
    email?: string
    subject: string
    message: string
}) {
    try {
        const name = data.name?.trim()
        const phone = data.phone?.trim()
        const subject = data.subject?.trim()
        const message = data.message?.trim()
        const email = data.email?.trim().toLowerCase() || null

        if (!name || !phone || !subject || !message) {
            return { success: false, error: 'Please fill in all required fields' }
        }

        if (name.length > 120 || phone.length > 40 || subject.length > 120 || message.length > 5000) {
            return { success: false, error: 'One or more fields are too long' }
        }

        const inquiry = await prisma.contactInquiry.create({
            data: { name, phone, email, subject, message },
        })

        void sendContactInquiryNotification(inquiry)

        return { success: true, data: { id: inquiry.id } }
    } catch (error) {
        console.error('Contact inquiry error:', error)
        return { success: false, error: 'Failed to send message. Please try again.' }
    }
}
