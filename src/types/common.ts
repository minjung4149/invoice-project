//확정하기 버튼 클릭
export interface InvoiceDetail {
  name: string; // 상품명
  quantity: number; // 수량
  price: number; // 단가
}

export interface InvoiceRequest {
  no: number; // 영수증번호
  clientId: number; // 거래처 ID
  balance: number; // 잔금
  payment: number; // 입금
  details: InvoiceDetail[]; // 상품 목록
}

// 인보이스 아이템 데이터 타입 정의
export interface InvoiceItem {
  name: string;
  spec: string;
  quantity: string;
  price: string;
  total: string;
}

// 인보이스 전체 데이터 타입 정의
export interface InvoiceData {
  invoiceNumber: string;
  year: string;
  month: string;
  day: string;
  items: InvoiceItem[];
  payment: string;
  note: string;
}