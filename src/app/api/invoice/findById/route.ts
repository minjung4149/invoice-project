import {NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

// GET 요청 - 특정 Invoice 조회
export async function GET(req: Request) {
  try {
    const {searchParams} = new URL(req.url);
    const invoiceId = searchParams.get('id');

    if (!invoiceId) {
      return NextResponse.json(
        { error: "유효한 Invoice ID가 필요합니다." },
        { status: 400 }
      );
    }

    // 특정 Invoice 조회 (Client 정보 및 InvoiceDetail 포함)
    const invoice = await prisma.invoice.findUnique({
      where: {id: Number(invoiceId)},
      include: {
        client: {select: {name: true, phone: true, balance: true}},
        details: {select: {name: true, quantity: true, price: true}},
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }


    return NextResponse.json(invoice, {status: 200});
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  }
}
