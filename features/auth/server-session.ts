import "server-only";

import { redirect } from "next/navigation";
import { serverApi } from "@/lib/api/server";
import type { components } from "@/lib/api/schema";
import { loginHref } from "./return-to";

type MeResponse = components["schemas"]["MeResponse"];
type UserPublic = components["schemas"]["UserPublic"];

export async function getServerSession(): Promise<MeResponse> {
  return serverApi.get<MeResponse>("/auth/me", {
    cache: "no-store",
  });
}

export async function requireCustomer(returnTo: string): Promise<UserPublic> {
  const session = await getServerSession();
  if (!session.authenticated || !session.user) {
    redirect(loginHref(returnTo));
  }
  if (session.user.role !== "customer") {
    redirect("/admin/");
  }
  return session.user;
}

export async function getCustomerProfile(): Promise<UserPublic | null> {
  try {
    return await serverApi.get<UserPublic>("/account/profile", {
      cache: "no-store",
    });
  } catch {
    return null;
  }
}
