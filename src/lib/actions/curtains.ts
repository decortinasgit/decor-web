import { z } from "zod";
import { eq, inArray, sql } from "drizzle-orm";

import { db } from "@/db";
import { accessories, curtains } from "@/db/schema";
import { curtainSchema } from "../validations/curtains";
import { revalidatePath } from "next/cache";
import { accessorySchema } from "../validations/accesories";

export async function addCurtain(rawInput: z.infer<typeof curtainSchema>) {
  try {
    const curtain = await db
      .insert(curtains)
      .values({
        id: rawInput.id,
        name: rawInput.name,
        type: rawInput.type,
        color: rawInput.color,
        price: rawInput.price.toString(),
        unity: rawInput.unity,
        category: rawInput.category,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ insertedId: curtains.id });

    return {
      data: curtain,
      error: null,
    };
  } catch (err) {
    console.error("Error adding curtain:", err);
    return {
      data: null,
      error: err,
    };
  }
}

export async function addMultipleCurtains(
  rawInput: z.infer<typeof curtainSchema>[]
) {
  const CHUNK_SIZE = 100;
  const chunks = [];

  let updatedCount = 0;

  for (let i = 0; i < rawInput.length; i += CHUNK_SIZE) {
    chunks.push(rawInput.slice(i, i + CHUNK_SIZE));
  }

  try {
    for (const chunk of chunks) {
      await db.transaction(async (trx) => {
        for (const input of chunk) {
          const existingCurtain = await trx.query.curtains.findFirst({
            columns: {
              id: true,
              name: true,
              type: true,
              color: true,
              price: true,
            },
            where: eq(curtains.id, input.id),
          });

          if (existingCurtain) {
            const hasChanges =
              existingCurtain.name !== input.name ||
              existingCurtain.type !== input.type ||
              existingCurtain.color !== input.color ||
              parseFloat(existingCurtain.price) !== input.price;

            if (hasChanges) {
              await trx
                .update(curtains)
                .set({
                  ...input,
                  price: input.price.toString(),
                  updatedAt: new Date(),
                })
                .where(eq(curtains.id, input.id));
              updatedCount++;
            }
          } else {
            await trx.insert(curtains).values({
              ...input,
              price: input.price.toString(),
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            updatedCount++;
          }
        }
      });
    }

    revalidatePath(`/dashboard/curtains`);

    console.log(`${updatedCount} curtains were updated or added.`);

    return {
      data: null,
      error: null,
      updatedCount,
    };
  } catch (err) {
    console.log("====================================");
    console.log(err);
    console.log("====================================");
    return {
      data: null,
      error: err,
      updatedCount,
    };
  }
}

export async function getCurtains() {
  try {
    const transaction = await db.transaction(async (tx) => {
      const data = await tx.select().from(curtains);

      const total = await tx
        .select({
          count: sql`COUNT(${curtains.id})`,
        })
        .from(curtains)
        .execute()
        .then((res) => res[0]?.count ?? 0);

      return {
        data,
        total,
      };
    });

    return transaction;
  } catch (err) {
    console.error("Error fetching curtains:", err);
    return {
      data: [],
      pageCount: 0,
      total: 0,
      error: err,
    };
  }
}

export async function deleteCurtains(curtainIds: string[]) {
  try {
    if (curtainIds.length === 0) {
      console.log("No curtains to delete.");
      return {
        data: null,
        error: null,
        deletedCount: 0,
      };
    }

    console.log("Attempting to delete the following curtain IDs:", curtainIds);

    await db.transaction(async (trx) => {
      const result = await trx
        .delete(curtains)
        .where(inArray(curtains.id, curtainIds));

      console.log(`${result.count} curtains were deleted from the database.`);
    });

    revalidatePath(`/dashboard/curtains`);

    return {
      data: null,
      error: null,
      deletedCount: curtainIds.length,
    };
  } catch (err) {
    return {
      data: null,
      error: err,
      deletedCount: 0,
    };
  }
}

export async function addMultipleAccessories(
  rawInput: z.infer<typeof accessorySchema>[]
) {
  const CHUNK_SIZE = 100;
  const chunks = [];

  let updatedCount = 0;

  for (let i = 0; i < rawInput.length; i += CHUNK_SIZE) {
    chunks.push(rawInput.slice(i, i + CHUNK_SIZE));
  }

  try {
    for (const chunk of chunks) {
      await db.transaction(async (trx) => {
        for (const input of chunk) {
          const existingAccessory = await trx.query.accessories.findFirst({
            columns: {
              id: true,
              name: true,
              type: true,
              color: true,
              price: true,
            },
            where: eq(accessories.id, input.id),
          });

          if (existingAccessory) {
            const hasChanges =
              existingAccessory.name !== input.name ||
              existingAccessory.type !== input.type ||
              existingAccessory.color !== input.color ||
              parseFloat(existingAccessory.price) !== input.price;

            if (hasChanges) {
              await trx
                .update(accessories)
                .set({
                  ...input,
                  price: input.price.toString(),
                  updatedAt: new Date(),
                })
                .where(eq(accessories.id, input.id));
              updatedCount++;
            }
          } else {
            await trx.insert(accessories).values({
              ...input,
              price: input.price.toString(),
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            updatedCount++;
          }
        }
      });
    }

    revalidatePath(`/dashboard/accessories`);

    console.log(`${updatedCount} accessories were updated or added.`);

    return {
      data: null,
      error: null,
      updatedCount,
    };
  } catch (err) {
    console.error("Error adding multiple accessories:", err);
    return {
      data: null,
      error: err,
      updatedCount,
    };
  }
}

export async function getAccessories() {
  try {
    const transaction = await db.transaction(async (tx) => {
      const data = await tx.select().from(accessories);

      const total = await tx
        .select({
          count: sql`COUNT(${accessories.id})`,
        })
        .from(accessories)
        .execute()
        .then((res) => res[0]?.count ?? 0);

      return {
        data,
        total,
      };
    });

    return transaction;
  } catch (err) {
    console.error("Error fetching accessories:", err);
    return {
      data: [],
      total: 0,
      error: err,
    };
  }
}

export async function deleteAccessories(accessoryIds: string[]) {
  try {
    if (accessoryIds.length === 0) {
      console.log("No accessories to delete.");
      return {
        data: null,
        error: null,
        deletedCount: 0,
      };
    }

    console.log(
      "Attempting to delete the following accessory IDs:",
      accessoryIds
    );

    await db.transaction(async (trx) => {
      const result = await trx
        .delete(accessories)
        .where(inArray(accessories.id, accessoryIds));

      console.log(
        `${result.count} accessories were deleted from the database.`
      );
    });

    revalidatePath(`/dashboard/accessories`);

    return {
      data: null,
      error: null,
      deletedCount: accessoryIds.length,
    };
  } catch (err) {
    return {
      data: null,
      error: err,
      deletedCount: 0,
    };
  }
}
