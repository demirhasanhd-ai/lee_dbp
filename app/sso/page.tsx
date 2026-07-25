import type { Metadata } from "next";
import { headers } from "next/headers";
import { SsoLanding } from "./SsoLanding";
import { verifyEEnstituDbpTicket } from "../../lib/eEnstituSso";

export const metadata: Metadata = { title: "e-Enstitu Gecisi" };

export default async function SsoPage({
  searchParams,
}: {
  searchParams: Promise<{ ticket?: string }>;
}) {
  const { ticket = "" } = await searchParams;
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "";
  const forwardedProto =
    requestHeaders.get("x-forwarded-proto") ||
    (forwardedHost.startsWith("localhost") || forwardedHost.startsWith("127.0.0.1") ? "http" : "https");
  const fallbackBaseUrl = forwardedHost ? `${forwardedProto}://${forwardedHost}` : undefined;
  const result = await verifyEEnstituDbpTicket(ticket, fallbackBaseUrl);
  return <SsoLanding session={result.session} error={result.error} eEnstituUrl={fallbackBaseUrl} />;
}
