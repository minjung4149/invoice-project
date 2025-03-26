"use client";
import {useParams} from "next/navigation";
import HeaderDetail from "@/components/header/HeaderDetail";

const HeaderDetailClient = () => {
  const params = useParams();

  const clientName = params.name
    ? decodeURIComponent(Array.isArray(params.name) ? params.name[0] : params.name).replace(/-/g, ' ')
    : '';

  return <HeaderDetail clientName={clientName}/>;
};

export default HeaderDetailClient;
