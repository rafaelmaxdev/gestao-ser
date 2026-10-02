import "server-only";

import { auth } from "@clerk/nextjs/server";
import { getPrisma } from "@/lib/db";

export type SchoolAccess =
  | { status: "setup-required" }
  | { status: "pending-access" }
  | { status: "unavailable" }
  | {
      status: "authorized";
      user: {
        id: string;
        clerkUserId: string;
        name: string | null;
        email: string | null;
      };
      memberships: Array<{
        id: string;
        userId: string;
        unitId: string;
        role: string;
        unit: {
          id: string;
          name: string;
        };
      }>;
    };

export async function getSchoolAccess(): Promise<SchoolAccess> {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn({ returnBackUrl: "/sistema" });
  }

  if (!process.env.DATABASE_URL) {
    return { status: "setup-required" };
  }

  try {
    const user = await getPrisma().appUser.findUnique({
      where: { clerkUserId: userId },
      include: {
        memberships: {
          include: { unit: true },
        },
      },
    });

    if (!user || user.memberships.length === 0) {
      return { status: "pending-access" };
    }

    return {
      status: "authorized",
      user,
      memberships: user.memberships,
    };
  } catch {
    return { status: "unavailable" };
  }
}
