'use client'

import { Button } from "@/components/custom/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, CheckCircle, Store } from 'lucide-react'
import { CurtainsTable } from "../_components/curtains-table/curtains-table"
import { Curtain } from "@/types/curtains"
import { useRouter } from "next/navigation"

interface OrderSuccessProps {
    orderId: string
    totalAmount: number
    curtains: Array<Curtain>
}

export default function BudgetID({ orderId = "ORD-12345", totalAmount = 99.99, curtains = [
    {
        "qty": 2,
        "name": "Alza Paños",
        "type": "-",
        "color": "-",
        "height": 2,
        "width": 2,
        "price": '19.00'
    }
] }: OrderSuccessProps) {
    const router = useRouter()

    return (
        <Card className="w-full mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <CheckCircle className="text-green-500" />
                    Pedido exítoso
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold">Resumen del pedido</h2>
                        <p className="text-gray-600">ID: {orderId}</p>
                    </div>
                    <div className="shrink-0 bg-border h-[1px] w-full" />
                    <div>
                        <CurtainsTable data={curtains} pageCount={1} hideActions/>
                    </div>
                    <div className="shrink-0 bg-border h-[1px] w-full" />
                    <div className="text-right">
                        <p className="text-lg font-semibold">Total: ${totalAmount.toFixed(2)}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex gap-5">
                <Button onClick={() => router.replace('/orders')} className="w-full" variant='outline'>
                    <Store className="mr-2 h-4 w-4" /> Ver Pedidos
                </Button>
                <Button onClick={() => { }} className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Descargar PDF
                </Button>
            </CardFooter>
        </Card>
    )
}