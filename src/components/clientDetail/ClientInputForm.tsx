"use client";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAppleWhole, faPlus, faArrowUpRightFromSquare} from "@fortawesome/free-solid-svg-icons";
import {InvoiceItem, InvoiceData} from "@/types/common";

interface ClientInputFormProps {
  invoiceData: InvoiceData;
  setInvoiceData: React.Dispatch<React.SetStateAction<InvoiceData>>;
  setIsUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}

// 과일 카테고리 데이터
const fruitCategories: Record<string, string[]> = {
  사과: ["사과", "사과(부사)", "사과(홍로)", "사과(시나몬골드)", "사과(아오리)"],
  배: ["배", "배(신고)", "배(원황)"],
  포도: ["포도(켐벨)", "포도(머루)", "거봉 2kg", "거봉 4kg", "샤인 2kg", "샤인 4kg"],
  복숭아: ["복숭아", "복숭아(백도)", "복숭아(황도)", "천도복숭아"],
  딸기: ["딸기", "딸기(설향)", "딸기(죽향)", "딸기(금실)", "딸기(스치)"],
  귤: ["밀감", "밀감S", "밀감M", "밀감L", "밀감2L", "한라봉", "천혜향", "레드향", "황금향"],
  여름: ["수박", "참외", "자두", "자두(후무사)", "토마토"],
  감: ["단감", "대봉", "홍시"],
  오렌지: ["오렌지", "오렌지(56)", "오렌지(72)"],
  키위: ["키위(그린키위)", "키위(골드키위)"],
  바나나: ["바나나", "바나나(6)", "바나나(9)"],
  수입: ["레몬", "석류", "아보카도", "자몽", "파인애플", "골드파인", "망고", "애플망고"],
  기타: ["무화과", "체리", "블루베리", "멜론", "멜론(3)", "멜론(4)", "용과"],
};

// 숫자 포맷팅 함수 (천 단위 콤마 추가)
const formatNumber = (value: string) => {
  return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const convertToKoreanCurrency = (num: number): string => {
  if (num === 0) return "원";

  const numberText = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
  const unitText = ["", "십", "백", "천"];
  const bigUnitText = ["", "만", "억", "조"];

  let result = "";
  let unitIndex = 0;
  let bigUnitIndex = 0;
  let chunk = "";

  while (num > 0) {
    const digit = num % 10;
    if (digit !== 0) {
      let word = numberText[digit] + unitText[unitIndex];

      // '일십' → '십' 처리 (단, 만/억/조 단위에서는 '일' 유지)
      if (digit === 1 && unitIndex === 1) {
        word = "십";
      }

      chunk = word + chunk;
    }

    unitIndex++;

    if (unitIndex > 3) {
      unitIndex = 0;

      // 현재 자리수(천 이하)가 비어있지 않다면, 큰 단위(만, 억 등) 추가
      if (chunk !== "") {
        result = chunk + bigUnitText[bigUnitIndex] + " " + result;
      }

      chunk = "";
      bigUnitIndex++;
    }

    num = Math.floor(num / 10);
  }

  // 남아 있는 chunk 처리 (예: "오백만")
  if (chunk !== "") {
    result = chunk + bigUnitText[bigUnitIndex] + " " + result;
  }

  return result.replace(/\s+/g, "").trim() + " 원"; // 공백 정리
};


const ClientInputForm = ({invoiceData, setInvoiceData, setIsUpdated}: ClientInputFormProps) => {
  const today = new Date();
  const currentYear = today.getFullYear().toString();
  const currentMonth = (today.getMonth() + 1).toString().padStart(2, "0");
  const currentDay = today.getDate().toString().padStart(2, "0");
  // 확인 여부 상태 (제출 후 true)
  const [isConfirmed, setIsConfirmed] = useState(false);

  // 현재 포커스된 `input`의 index 저장
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null); // 현재 포커스된 `input`의 index 저장

  // 과일 선택 모달 표시 여부
  const [showFruitOptions, setShowFruitOptions] = useState(false);

  // 폼 데이터 상태 (부모 데이터 반영)
  const [formData, setFormData] = useState<InvoiceData>({
    invoiceNumber: `INVOICE-${invoiceData.invoiceNumber}`,
    year: currentYear,
    month: currentMonth,
    day: currentDay,
    items: Array.from({length: 5}, () => ({name: "", quantity: "", price: "", total: ""})),
    payment: "",
    note: "",
  });

  // `invoiceData.invoiceNumber` 변경 시 formData 반영
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      invoiceNumber: invoiceData.invoiceNumber.startsWith("INVOICE-")
        ? invoiceData.invoiceNumber
        : `INVOICE-${invoiceData.invoiceNumber}`,
    }));
  }, [invoiceData.invoiceNumber]);

  // 입력값 에러 상태
  const [errors, setErrors] = useState<{ items: boolean[]; month: boolean; day: boolean }>({
    items: new Array(5).fill(false),
    month: false,
    day: false,
  });

  // `input` 포커스 핸들러 (현재 포커스된 `input`의 index를 설정)
  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  // 과일 옵션 클릭 핸들러 (선택된 과일을 현재 포커스된 항목의 `name` 필드에 입력)
  const handleFruitClick = (fruit: string) => {
    if (focusedIndex === null) return; // 포커스된 input이 없으면 실행 안 함

    setFormData((prev) => {
      const updatedItems = prev.items.map((item, i) =>
        i === focusedIndex ? {...item, name: fruit} : item
      );
      return {...prev, items: updatedItems};
    });
  };

  // 일반 입력 필드 변경 핸들러 (숫자 입력값은 `formatNumber` 적용)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "payment" ? formatNumber(value) : value,
    }));
  };

  // 개별 항목 변경 핸들러 (수량과 가격 변경 시 `total` 자동 계산)
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string) => {
    const formattedValue = field === "quantity" || field === "price" ? formatNumber(value) : value;

    setFormData((prev) => {
      const updatedItems = prev.items.map((item, i) => {
        if (i === index) {
          const newItem = {...item, [field]: formattedValue};
          const quantity = parseInt(newItem.quantity.replace(/,/g, ""), 10) || 0;
          const price = parseInt(newItem.price.replace(/,/g, ""), 10) || 0;
          const total = quantity * price;

          return {...newItem, total: total.toLocaleString()};
        }
        return item;
      });

      return {...prev, items: updatedItems};
    });

    setErrors((prev) => {
      const newErrors = {...prev};
      newErrors.items[index] = false;
      return newErrors;
    });
  };

  // 항목 삭제 핸들러
  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));

    setErrors((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // 항목 추가 핸들러
  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, {name: "", quantity: "", price: "", total: ""}],
    }));

    setErrors((prev) => ({
      ...prev,
      items: [...prev.items, false],
    }));
  };

  // 폼 제출 핸들러 (입력값 검증 후 `setInvoiceData` 호출)
  const handleSubmit = () => {
    const monthError = !formData.month.trim();
    const dayError = !formData.day.trim();

    const newErrors = formData.items.map((item) => {
      const hasInput = !!item.name.trim() || !!item.quantity.trim() || !!item.price.trim();
      const isIncomplete = !item.name.trim() || !item.quantity.trim() || !item.price.trim();
      return hasInput && isIncomplete;
    });

    setErrors({items: newErrors, month: monthError, day: dayError});

    if (monthError || dayError || newErrors.includes(true)) {
      alert("입력되지 않은 필드가 있습니다. 확인 후 다시 시도하세요.");
      return;
    }

    setInvoiceData(formData);
    setIsConfirmed(true);
    setIsUpdated(true);
  };

  return (
    <div className="invoice-form">
      {/* 영수증 번호 */}
      <div className="invoice-number">영수증 번호: {formData.invoiceNumber}</div>

      {/* 반영하기 버튼 */}
      <div className="action-buttons">
        <button className={isConfirmed ? "active" : "inactive"} onClick={handleSubmit}>
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="icon"/>
          반영하기
        </button>
      </div>

      {/* 날짜 입력 */}
      <div className="date-group">
        <span className="year">{formData.year}년</span>
        <input
          type="text"
          name="month"
          placeholder="MM"
          value={formData.month}
          maxLength={2}
          onChange={handleInputChange}
          className={errors.month ? "error-border" : ""}
        />
        <span>월</span>
        <input
          type="text"
          name="day"
          placeholder="DD"
          value={formData.day}
          maxLength={2}
          onChange={handleInputChange}
          className={errors.day ? "error-border" : ""}
        />
        <span>일</span>
      </div>

      <hr className="divider narrow"/>
      <button className="toggle-fruit-btn" onClick={() => setShowFruitOptions(!showFruitOptions)}>
        <FontAwesomeIcon icon={faAppleWhole} className="icon"/>
        {showFruitOptions ? "과일 목록 닫기" : "과일 목록 보기"}
      </button>

      {/* 과일 목록 모달 */}
      {showFruitOptions && (
        <div className="fruit-options">
          <button className="close-btn" onClick={() => setShowFruitOptions(false)}>✕</button>
          {Object.entries(fruitCategories).map(([category, fruits]) => (
            <div key={category} className="fruit-category">
              <h4>{category}</h4>
              <div className="fruit-buttons">
                {fruits.map((fruit) => (
                  <button key={fruit} onClick={() => handleFruitClick(fruit)}>
                    {fruit}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <hr className="divider narrow"/>

      {/* 품목 입력 */}
      <div className=" item-group">
        <div className="input-header">
          <span className="left">No.</span>
          <span>품명</span>
          <span>수량</span>
          <span>단가</span>
          <span></span>
        </div>

        {formData.items.map((item, index) => (
          <div key={index} className="input-row">
            <span>{index + 1}</span>
            <input
              type="text"
              placeholder="품명"
              value={item.name}
              className={errors.items[index] && !item.name ? "error-border" : ""}
              onFocus={() => handleFocus(index)} // 🔹 포커스 감지
              onChange={(e) => handleItemChange(index, "name", e.target.value)}
            />
            <input
              type="text"
              className={`quantity ${errors.items[index] && !item.quantity ? "error-border" : ""}`}
              placeholder="수량"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
            />
            <input
              type="text"
              className={`price ${errors.items[index] && !item.price ? "error-border" : ""}`}
              placeholder="단가"
              value={item.price}
              onChange={(e) => handleItemChange(index, "price", e.target.value)}
            />
            <button className="remove-btn" onClick={() => handleRemoveItem(index)}>✕</button>
          </div>
        ))}

        <button className="add-item" onClick={handleAddItem}>
          <FontAwesomeIcon icon={faPlus} className="icon"/>품목 추가
        </button>
      </div>
      <hr className="divider"/>

      {/* 입금액 & 비고 입력 */}
      <div className="payment-group">
        <label>입금액</label>
        <input
          type="text"
          name="payment"
          placeholder="입금액"
          value={formData.payment}
          onChange={handleInputChange}
        />
        <span className="korean-number">
    {convertToKoreanCurrency(parseInt(formData.payment.replace(/,/g, ""), 10) || 0)}
        </span>
      </div>
      <div className="note-group">
        <label>비고</label>
        <textarea
          name="note"
          placeholder="비고"
          value={formData.note}
          onChange={handleInputChange}
        />
      </div>
      {/* 추가 반영하기 버튼 */}
      <div className="action-buttons-bottom">
        <button className={isConfirmed ? "active" : "inactive"} onClick={handleSubmit}>
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="icon"/>
          반영하기
        </button>
      </div>
    </div>
  );
};

export default ClientInputForm;

