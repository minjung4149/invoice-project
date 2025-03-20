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
