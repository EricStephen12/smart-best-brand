import toast from 'react-hot-toast';

export function exportOrdersToCSV(orders: any[], filenamePrefix: string = 'smart-best-brands-orders') {
  if (!orders || orders.length === 0) {
    toast.error('No orders available to export');
    return false;
  }

  try {
    const headers = [
      'Order Number',
      'Date & Time',
      'Status',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Delivery Address',
      'Delivery Location',
      'Payment Method',
      'Payment Reference',
      'Items Ordered',
      'Total Items Count',
      'Subtotal (NGN)',
      'Delivery Fee (NGN)',
      'Discount (NGN)',
      'Promo Code',
      'Total Amount (NGN)',
      'Customer Notes',
    ];

    const escapeCsv = (val: unknown): string => {
      if (val === null || val === undefined) return '""';
      const str = String(val).trim();
      // RFC 4180: escape internal double quotes by doubling them
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = orders.map((order) => {
      const formattedDate = order.createdAt
        ? new Date(order.createdAt).toISOString().replace('T', ' ').substring(0, 19)
        : '';

      const itemsSummary = (order.items || [])
        .map((item: any) => {
          const prodName =
            item.variant?.product?.name ||
            item.productName ||
            item.name ||
            'Mattress / Furniture Item';
          const size = item.variant?.size?.label ? ` (${item.variant.size.label})` : '';
          const qty = item.quantity || 1;
          const price = item.price ? ` @ ₦${Number(item.price).toLocaleString()}` : '';
          return `${qty}x ${prodName}${size}${price}`;
        })
        .join('; ');

      const totalItemsCount = (order.items || []).reduce(
        (sum: number, item: any) => sum + (item.quantity || 1),
        0
      );

      return [
        escapeCsv(order.orderNumber),
        escapeCsv(formattedDate),
        escapeCsv(order.status || 'PENDING'),
        escapeCsv(order.customerName || ''),
        escapeCsv(order.customerEmail || ''),
        escapeCsv(order.customerPhone || ''),
        escapeCsv(order.deliveryAddress || ''),
        escapeCsv(order.deliveryLocation || ''),
        escapeCsv(order.paymentMethod || 'PAYSTACK'),
        escapeCsv(order.paymentReference || ''),
        escapeCsv(itemsSummary),
        escapeCsv(totalItemsCount),
        escapeCsv(order.subtotal ?? 0),
        escapeCsv(order.deliveryFee ?? 0),
        escapeCsv(order.discount ?? 0),
        escapeCsv(order.promoCode || ''),
        escapeCsv(order.total ?? 0),
        escapeCsv(order.notes || ''),
      ].join(',');
    });

    // Prepend UTF-8 BOM (\uFEFF) so Microsoft Excel opens special characters and Nigerian Naira figures cleanly
    const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filenamePrefix}-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${orders.length} order${orders.length === 1 ? '' : 's'} to CSV!`);
    return true;
  } catch (error) {
    console.error('Failed to export orders to CSV:', error);
    toast.error('An error occurred while generating the CSV file.');
    return false;
  }
}
