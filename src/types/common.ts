export interface Client {
  id: number | null;
  name: string;
  phone: string;
  note?: string;
  isFavorite: boolean;
}

export interface ClientRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (client: Client) => void;
  initialData?: Client | null;
}

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
