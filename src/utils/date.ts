/**
 * ISO 형식의 날짜 문자열을 한국 시간 기준으로 포맷된 문자열로 변환합니다.
 * @param isoString ISO 8601 문자열 (예: 2025-04-08T06:45:59.390Z)
 * @returns "YYYY-MM-DD HH:mm" 형식의 문자열
 */
export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}`;
};
