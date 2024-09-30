import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AddOrderForm } from "./add-order-form"

const AddOrder = () => {
  return (
    <Card className="mt-5 border-primary border-r-2">
      <CardHeader className="flex justify-between pb-2">
        <CardTitle className="font-bold">Crear un presupuesto</CardTitle>
        <CardDescription>
          Usa el cotizador para obtener el presupuesto de tu pedido y agregarlo
          a tu carrito.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AddOrderForm />
      </CardContent>
    </Card>
  )
}

export default AddOrder
