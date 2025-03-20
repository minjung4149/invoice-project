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
  refreshClients: () => void;
}

export default function ClientList({clients, refreshClients}: ClientListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  /**
   * 거래처 수정 버튼 클릭 시 실행되는 함수
   * @param client 선택된 거래처 정보
   */
  const handleEditClick = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  /**
   * 거래처 정보 수정 후 저장하는 함수 (모달 내에서 사용)
   * @param updatedClient 수정된 거래처 객체
   */
  const handleRegisterClient = async (updatedClient: Client) => {
    try {
      await updateClient(updatedClient); // 서버에 업데이트 요청
      refreshClients(); // 최신 거래처 목록을 다시 불러옴
      setIsModalOpen(false);
      alert('거래처 정보가 수정되었습니다.');
    } catch (error) {
      console.error('거래처 정보 수정 실패: 서버 응답 오류 또는 네트워크 문제', error);
      alert('거래처 정보를 수정하는 중 오류가 발생했습니다.');
    }
  };


  /**
   * 즐겨찾기 버튼 클릭 시 실행되는 함수
   * @param id 거래처 ID
   * @param isFavorite 현재 즐겨찾기 상태
   */
  const toggleFavorite = async (id: number, isFavorite: boolean) => {
    try {
      await updateFavorite({id, isFavorite: !isFavorite}); // 즐겨찾기 상태 변경 요청
      refreshClients(); // 변경된 데이터를 반영하기 위해 최신 거래처 목록을 다시 불러옴
    } catch (error) {
      console.error(`즐겨찾기 변경 실패 (거래처 ID: ${id}): 서버 응답 오류 또는 네트워크 문제`, error);
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
              {/* 수정 */}
              <button onClick={() => handleEditClick(client)}>
                <Image src="/images/edit.png" alt="수정" width={24} height={24}/>
              </button>

              {/* 즐겨찾기 */}
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

      {/* 거래처 수정 모달 */}
      {isModalOpen && (
        <ClientRegisterModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedClient(null);
          }}
          onRegister={handleRegisterClient}
          initialData={selectedClient}
        />
      )}
    </div>
  );
}
