import { NextResponse } from "next/server";
import { users } from "@/lib/fakeData";

interface RouteContext {
  params: Promise<{
    city?: string;
  }>;
}

export async function GET(_: Request, context: RouteContext) {
  try {
    const params = await context.params;
    const cityParam = params.city ?? "";
    const normalized = cityParam.trim().toLowerCase();

    if (!users || !Array.isArray(users)) {
      return NextResponse.json(
        { error: "Users data not available" },
        { status: 500 }
      );
    }

    const filtered = users.filter(
      (user) => user.city && user.city.toLowerCase() === normalized,
    );

    return NextResponse.json({
      city: cityParam,
      count: filtered.length,
      users: filtered,
    });
  } catch (error) {
    console.error("Error in users API route:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
