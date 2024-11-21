// api/orders/[id].ts
import { NextApiRequest, NextApiResponse } from "next"
import { getOrderById } from "@/lib/actions/orders"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  try {
    const order = await getOrderById(id as string)
    res.status(200).json(order)
  } catch (error) {
    res.status(500).json({ error: "Error fetching order" })
  }
}
