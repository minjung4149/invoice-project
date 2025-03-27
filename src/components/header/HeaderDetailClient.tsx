"use client";
import {useSearchParams} from "next/navigation";
import HeaderDetail from "@/components/header/HeaderDetail";

const HeaderDetailClient = () => {
  const searchParams = useSearchParams();

  const clientName = searchParams.get("name") || "";
  const clientId = Number(searchParams.get("id") || 0);

  return <HeaderDetail clientName={clientName} clientId={clientId}/>;
};

export default HeaderDetailClient;