"use client";
import {useState, useEffect} from "react";
import Header from "@/components/header/Header";
import ClientList from "@/components/main/ClientList";
import {getClientList} from '@/utils/api';

interface Client {
  id: number | null;
  name: string;
  phone: string;
  note?: string;
  isFavorite: boolean;
}

const MainClient = () => {
  const [clients, setClients] = useState<Client[]>([]);

  // 거래처 목록을 가져와 상태에 저장하는 함수
  const fetchClients = async () => {
    try {
      const clientList = await getClientList();

      setClients(
        [...clientList].sort((a, b) =>
          Number(b.isFavorite) - Number(a.isFavorite) ||
          a.name.localeCompare(b.name, "ko-KR")
        )
      );
    } catch (error) {
      console.error("거래처 목록 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <>
      <Header onClientRegistered={fetchClients}/>
      <main className="site-content">
        <div className="container">
          <div className="main-wrapper">
            <section>
              <ClientList clients={clients} onRefresh={fetchClients} />
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default MainClient;
