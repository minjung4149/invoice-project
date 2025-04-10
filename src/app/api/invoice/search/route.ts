import {NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

// GET 요청 - 특정 Client의 Invoice 리스트 조회 (InvoiceDetail 가격 합계 포함)
export async function GET(req: Request) {
  try {
    const {searchParams} = new URL(req.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json({error: 'clientId는 필수입니다.'}, {status: 400});
    }

    // 특정 Client의 Invoice 리스트 조회
    const invoices = await prisma.invoice.findMany({
      where: {clientId: Number(clientId)},
      select: {
        id: true,
        no: true,
        createDate: true,
        balance: true,
        details: {
          select: {price: true, quantity: true}
        }
      },
      orderBy: {
        createDate: 'desc', // 최신순 정렬
      },
    });

    // InvoiceDetail의 가격(price) 합계를 계산하여 새로운 배열 생성
    const formattedInvoices = invoices.map(invoice => ({
      id: invoice.id,
      no: invoice.no,
      createDate: invoice.createDate,
      balance: invoice.balance,
      total: invoice.details.reduce((sum, detail) => sum + (detail.quantity * detail.price), 0),
    }));

    return NextResponse.json({invoices: formattedInvoices}, {status: 200});
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  }
}
