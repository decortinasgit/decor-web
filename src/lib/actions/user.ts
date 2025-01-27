import { z } from "zod";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";

import { db } from "@/db";
import { roles, User, users } from "@/db/schema";
import { getUsersSchema, signUpSchema } from "../validations/auth";
import { SearchParams } from "@/types";

export async function addUser(rawInput: z.infer<typeof signUpSchema>) {
  try {
    const user = await db
      .insert(users)
      .values({
        id: rawInput.email,
        name: rawInput.firstName,
        lastName: rawInput.lastName,
        email: rawInput.email,
        emailVerified: false,
        phone: rawInput.phone,
        businessName: rawInput.businessName,
        cuitOrDni: rawInput.cuitOrDni,
        province: rawInput.shippingAddress.province,
        state: rawInput.shippingAddress.state,
        address: rawInput.shippingAddress.address,
        preferredTransport: rawInput.preferredTransport,
        password: rawInput.password,
        roleId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ insertedId: users.id });

    return {
      data: user,
      error: null,
    };
  } catch (err) {
    console.log("====================================");
    console.log(err);
    console.log("====================================");
    return {
      data: null,
      error: err,
    };
  }
}

export async function getUsers(input: SearchParams) {
  noStore();

  try {
    const search = getUsersSchema.parse(input);

    const limit = search.per_page;
    const offset = ((search.page ?? 1) - 1) * (limit ?? 10);

    const [column, order] = (search.sort?.split(".") as [
      keyof User | undefined,
      "asc" | "desc" | undefined
    ]) ?? ["createdAt", "asc"];

    const filters = and(
      search.name
        ? sql`LOWER(${users.name}) LIKE LOWER(${`%${search.name}%`})`
        : undefined,
      search.email
        ? sql`LOWER(${users.email}) LIKE LOWER(${`%${search.email}%`})`
        : undefined,
      search.roleId ? eq(users.roleId, search.roleId) : undefined
    );

    const transaction = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          id: users.id,
          name: users.name,
          lastName: users.lastName,
          email: users.email,
          emailVerified: users.emailVerified,
          createdAt: users.createdAt,
          phone: users.phone,
          businessName: users.businessName,
          cuitOrDni: users.cuitOrDni,
          province: users.province,
          state: users.state,
          address: users.address,
          preferredTransport: users.preferredTransport,
          roleName: roles.name,
        })
        .from(users)
        .leftJoin(roles, eq(roles.id, users.roleId))
        .where(filters)
        .limit(limit)
        .offset(offset)
        .orderBy(
          column && column in users
            ? order === "asc"
              ? asc(users[column])
              : desc(users[column])
            : desc(users.createdAt)
        )

      const total = await tx
        .select({
          count: sql`COUNT(${users.id})`,
        })
        .from(users)
        .where(filters)
        .execute()
        .then((res) => res[0]?.count ?? 0);

      const pageCount = Math.ceil((total as number) / limit);

      return {
        data,
        pageCount,
        total,
      };
    });

    return transaction;
  } catch (err) {
    console.error("Error fetching users:", err);
    return {
      data: [],
      pageCount: 0,
      total: 0,
      error: err,
    };
  }
}

export async function getRoles() {
  noStore();

  try {
    const transaction = await db.transaction(async (tx) => {
      const data = await tx.select().from(roles);

      return {
        data,
      };
    });

    return transaction;
  } catch (err) {
    return {
      data: [],
      pageCount: 0,
      error: err,
    };
  }
}

export async function updateEmailVerifiedStatus(
  userId: string,
  status: boolean
) {
  try {
    const result = await db
      .update(users)
      .set({ emailVerified: status })
      .where(eq(users.email, userId))
      .returning({ updatedId: users.email });

    return {
      data: result,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: err,
    };
  }
}

export async function updateUserRole(userId: string, roleId: string) {
  try {
    const result = await db
      .update(users)
      .set({ roleId: roleId })
      .where(eq(users.email, userId))
      .returning({ updatedId: users.email });

    return {
      data: result,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: err,
    };
  }
}
