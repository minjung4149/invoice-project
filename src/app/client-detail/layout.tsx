import HeaderDetailClient from "@/components/header/HeaderDetailClient";

export default function ClientDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderDetailClient />
      <main>{children}</main>
    </>
  );
}