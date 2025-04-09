"use client";
import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import ClientRegisterModal from "@/components/main/ClientModal";
import {updateClient, updateFavorite} from '@/utils/api';

interface Client {
  id: number | null;
  name: string;
  phone: string;
  note?: string;
  isFavorite: boolean;
}

interface ClientListProps {
  clients: Client[];
  onRefresh: () => Promise<void>;
}

export default function ClientList({clients, onRefresh}: ClientListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // 거래처 수정 버튼 클릭
  const handleEditClick = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  // 거래처 정보 수정
  const handleRegisterClient = async (updatedClient: Client) => {
    try {
      await updateClient(updatedClient);
      await onRefresh(); // 🔥 클라이언트 상태 갱신
      setIsModalOpen(false);
      alert('거래처 정보가 수정되었습니다.');
    } catch (error) {
      console.error('거래처 정보 수정 실패:', error);
      alert('거래처 정보를 수정하는 중 오류가 발생했습니다.');
    }
  };

  // 즐겨찾기 토글
  const toggleFavorite = async (id: number, isFavorite: boolean) => {
    try {
      await updateFavorite({id, isFavorite: !isFavorite});
      await onRefresh(); // 🔥 클라이언트 상태 갱신
    } catch (error) {
      console.error(`즐겨찾기 변경 실패 (거래처 ID: ${id})`, error);
      alert('즐겨찾기 상태를 변경하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="client-list">
      <h2 className="under-line"> 거래처 리스트</h2>
      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            <div className="client-action">
              <button onClick={() => handleEditClick(client)}>
                <Image src="/images/edit.png" alt="수정" width={24} height={24}/>
              </button>

              <button onClick={() => toggleFavorite(client.id ?? 0, client.isFavorite)}>
                <Image
                  src={client.isFavorite ? "/images/favorite-on.png" : "/images/favorite-off.png"}
                  alt="즐겨찾기"
                  width={24}
                  height={24}
                />
              </button>
            </div>
            <div className="client-info">
              <Link href={`/client-detail?name=${encodeURIComponent(client.name)}&id=${client.id}`} passHref>
                <h3>{client.name}</h3>
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <ClientRegisterModal
          isOpen={isModalOpen}
          onCloseAction={() => {
            setIsModalOpen(false);
            setSelectedClient(null);
          }}
          onRegisterAction={handleRegisterClient}
          initialData={selectedClient}
        />
      )}
    </div>
  );
}
