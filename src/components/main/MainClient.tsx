"use client"
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
      // 거래처 목록을 비동기적으로 가져옴
      const clientList = await getClientList();

      // 가져온 목록을 정렬하여 상태 업데이트
      setClients(
        [...clientList].sort((a, b) =>
          // 1. isFavorite 값이 true(1)인 항목이 앞에 오도록 정렬 (내림차순)
          Number(b.isFavorite) - Number(a.isFavorite) ||
          // 2. 같은 우선순위 내에서는 한글 이름 기준 오름차순 정렬
          a.name.localeCompare(b.name, "ko-KR")
        ));
    } catch (error) {
      // 데이터 로딩 중 오류 발생 시 콘솔에 오류 메시지 출력
      console.error("거래처 목록 가져오기 실패:", error);
    }
  };

  // 컴포넌트가 마운트될 때(fetchClients 실행)
  useEffect(() => {
    fetchClients();
  }, []); // 의존성 배열이 빈 배열이므로 최초 렌더링 시 한 번만 실행됨

  return (
    <>
      <Header onClientRegistered={fetchClients}/>
      <main className="site-content">
        <div className="container">
          <div className="main-wrapper">
            <section>
              {/*거래처 리스트*/}
              <ClientList clients={clients}/>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default MainClient;
