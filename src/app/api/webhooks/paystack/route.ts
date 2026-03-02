import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const hash = crypto
            .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || '')
            .update(JSON.stringify(body))
            .digest('hex');

        if (hash !== req.headers.get('x-paystack-signature')) {
            return new NextResponse('Invalid signature', { status: 401 });
        }

        const event = body.event;
        const data = body.data;

        if (event === 'charge.success') {
            const orderNumber = data.reference;

            // In our system, we use the orderNumber as the Paystack reference
            await prisma.order.update({
                where: { orderNumber },
                data: {
                    status: 'PAID',
                    paymentReference: data.id.toString(), // Paystack's transaction ID
                }
            });

            revalidatePath('/account/orders');
        }

        return new NextResponse('OK', { status: 200 });
    } catch (error) {
        console.error('Paystack webhook error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
