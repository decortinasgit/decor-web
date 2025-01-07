import { eq } from "drizzle-orm";
import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";

import { db } from "@/db";
import { User, users } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";

export const getCachedUser = cache(async () => {
  noStore();
  try {
    return await currentUser();
  } catch (err) {
    console.error(err);
    return null;
  }
});

export async function getUserWithAttributes(): Promise<User | null> {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return null;
    }

    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.id, clerkUser.emailAddresses[0].emailAddress))
      .execute()
      .then((res) => res[0]);

    if (!dbUser) {
      return null;
    }

    return dbUser;
  } catch (err) {
    console.error("Error fetching user with attributes:", err);
    return null;
  }
}
