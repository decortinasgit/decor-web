import { z } from "zod"
import { eq } from "drizzle-orm"

import { db } from "@/db"
import { roles, users } from "@/db/schema"
import { signUpSchema } from "../validations/auth"

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
      .returning({ insertedId: users.id })

    return {
      data: user,
      error: null,
    }
  } catch (err) {
    console.log("====================================")
    console.log(err)
    console.log("====================================")
    return {
      data: null,
      error: err,
    }
  }
}

export async function getUsers() {
  try {
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

      return {
        data,
      }
    })

    return transaction
  } catch (err) {
    return {
      data: [],
      pageCount: 0,
      error: err,
    }
  }
}

export async function getRoles() {
  try {
    const transaction = await db.transaction(async (tx) => {
      const data = await tx.select().from(roles)

      return {
        data,
      }
    })

    return transaction
  } catch (err) {
    return {
      data: [],
      pageCount: 0,
      error: err,
    }
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
      .returning({ updatedId: users.email })

    return {
      data: result,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: err,
    }
  }
}

export async function updateUserRole(userId: string, roleId: string) {
  try {
    const result = await db
      .update(users)
      .set({ roleId: roleId })
      .where(eq(users.email, userId))
      .returning({ updatedId: users.email })

    return {
      data: result,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: err,
    }
  }
}
