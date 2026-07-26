import type { Metadata } from "next";
import { LocalDevSsoLanding } from "./LocalDevSsoLanding";

export const metadata: Metadata = { title: "Yerel DBP Geçişi" };

export default async function LocalSsoPage({
  searchParams,
}: {
  searchParams: Promise<{
    role?: string;
    name?: string;
    username?: string;
    department?: string;
    tcKimlik?: string;
    email?: string;
  }>;
}) {
  const params = await searchParams;
  return (
    <LocalDevSsoLanding
      input={{
        role: params.role || "",
        name: params.name || "",
        username: params.username || "",
        department: params.department || "",
        tcKimlik: params.tcKimlik || "",
        email: params.email || "",
      }}
    />
  );
}
