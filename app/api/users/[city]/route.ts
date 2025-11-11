import { NextResponse } from "next/server";

import { users } from "@/lib/fakeData";

interface RouteContext {
  params: Promise<{
    city?: string;
  }>;
}

export async function GET(_: Request, context: RouteContext) {
  const params = await context.params;
  const cityParam = params.city ?? "";
  const normalized = cityParam.trim().toLowerCase();

  const filtered = users.filter(
    (user) => user.city.toLowerCase() === normalized,
  );

  return NextResponse.json({
    city: cityParam,
    count: filtered.length,
    users: filtered,
  });
}
