import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { reduceInventory } from '@/actions/orders';
import { sendOrderNotification } from '@/lib/sms';

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
        const respData = body.data;

        if (event === 'charge.success') {
            const orderNumber = respData.reference;

            // In our system, we use the orderNumber as the Paystack reference
            const order = await prisma.order.update({
                where: { orderNumber },
                data: {
                    status: 'PAID',
                    paymentReference: respData.id.toString(), // Paystack's transaction ID
                }
            });

            if (order) {
                // Trigger inventory reduction
                await reduceInventory(order.id);

                // Trigger SMS notification
                await sendOrderNotification(order.customerPhone, order.orderNumber, order.total);
            }

            revalidatePath('/account/orders');
        }

        return new NextResponse('OK', { status: 200 });
    } catch (error) {
        console.error('Paystack webhook error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
