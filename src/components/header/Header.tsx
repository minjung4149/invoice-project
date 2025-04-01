"use client";
import {useState, useCallback} from "react";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faWonSign} from "@fortawesome/free-solid-svg-icons";
import ClientRegisterModal from "@/components/main/ClientModal";
import {createClient} from '@/utils/api';

interface Client {
  id: number | null;
  name: string;
  phone: string;
  note?: string;
  isFavorite: boolean;
}

const Header = ({onClientRegistered}: { onClientRegistered: () => void }) => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleRegister = useCallback(async (client: Client) => {
    try {
      await createClient(client);
      setIsRegisterModalOpen(false); // 모달 닫기
      onClientRegistered(); // 거래처 등록 후 리스트 업데이트
    } catch (error) {
      console.error("거래처 등록 실패:", error);
      alert("거래처 등록에 실패했습니다.");
    }
  }, [onClientRegistered]);

  return (
    <header>
      <div className="container">
        <div className="header_wrapper">
          <Link href="/main">
            <h1>중앙청과 20번</h1>
          </Link>
          <div className="btn-area">
            <button className="primary default" onClick={() => setIsRegisterModalOpen(true)}>
              <FontAwesomeIcon icon={faPlus} className="icon"/>
              신규 거래처 등록
            </button>
            <Link href="/remaining-balance" className="default">
              <FontAwesomeIcon icon={faWonSign} className="icon"/>
              거래처 잔금 확인
            </Link>
          </div>
        </div>
      </div>

      {/* 거래처 등록 모달 */}
      {isRegisterModalOpen && (
        <ClientRegisterModal
          isOpen={isRegisterModalOpen}
          onCloseAction={() => setIsRegisterModalOpen(false)}
          onRegisterAction={handleRegister}
        />
      )}
    </header>
  );
};

export default Header;
