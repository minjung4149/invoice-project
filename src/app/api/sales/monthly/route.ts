// app/api/sales/goods/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // prisma 인스턴스 경로 확인 필요

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const monthParam = searchParams.get('month'); // '2025-05' 형태

    if (!monthParam || !/^\d{4}-\d{2}$/.test(monthParam)) {
      return NextResponse.json({ error: 'Invalid or missing `month` query param (format: YYYY-MM)' }, { status: 400 });
    }

    const [year, month] = monthParam.split('-').map(Number);
    const fromDate = new Date(year, month - 1, 1);
    const toDate = new Date(year, month, 1); // 다음 달 1일

    const results = await prisma.invoiceDetail.groupBy({
      by: ['name', 'spec'],
      _sum: {
        quantity: true,
        price: true,
      },
      where: {
        invoice: {
          createDate: {
            gte: fromDate,
            lt: toDate,
          },
        },
      },
    });

    const response = results.map((item) => ({
      name: item.name,
      spec: item.spec,
      total_quantity: item._sum.quantity ?? 0,
      total_revenue: (item._sum.quantity ?? 0) * (item._sum.price ?? 0),
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error('[INVOICE SUMMARY ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
