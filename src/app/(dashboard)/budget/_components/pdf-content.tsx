import type { OrderItem } from "@/db/schema";
import { CurtainsTablePDF } from "./curtains-table/curtains-table-pdf";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Icons } from "@/components/icons";

interface PDFContentProps {
  curtains: Array<OrderItem> | undefined;
  clientName: string;
  quoteDate: string;
  total: string;
  comment?: string | null;
}

export function PDFContent({
  curtains,
  clientName,
  quoteDate,
  total,
  comment,
}: PDFContentProps) {
  if (!curtains) {
    return (
      <div id="pdf-content" className="p-8 bg-white">
        <h3 className="text-xl font-semibold text-center text-red-600">
          No puedes enviar un presupuesto vacío
        </h3>
      </div>
    );
  }

  const itemsWithComments = curtains.filter((item) => item.comment);

  return (
    <div id="pdf-content" className="p-8 bg-white space-y-8">
      {/* Header */}
      <Card className="border-none shadow-md">
        <CardHeader className="text-primary-foreground p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icons.logo className="size-12" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold">Decortinas</span>
                <span className="text-sm">Distribuidores</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">Cliente: {clientName}</p>
              <p className="text-sm">Fecha del presupuesto: {quoteDate}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Curtains Table */}
      <CurtainsTablePDF curtains={curtains} total={total} />

      {/* Comment Section */}
      {(comment || itemsWithComments.length > 0) && (
        <Card className="border-none shadow-md">
          <CardHeader className="bg-secondary">
            <h3 className="text-lg font-semibold">Comentarios del Pedido: </h3>
          </CardHeader>
          <CardContent className="p-6">
            {comment && (
              <p className="text-sm leading-6 border-b pb-3">
                <strong>Comentario General:</strong>
                {comment}
              </p>
            )}
            {itemsWithComments.length > 0 && (
              <div className="space-y-4 text-sm leading-6">
                {itemsWithComments.map((item, index) => (
                  <div key={index} className="border-b pb-3">
                    <p>
                      <strong>{item.name}</strong>: {item.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Static FAQ Section */}
      <Card className="border-none shadow-md">
        <CardHeader className="bg-secondary">
          <h3 className="text-lg font-semibold">PREGUNTAS FRECUENTES:</h3>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm leading-6">
            {[
              {
                title: "Métodos de Pago",
                content:
                  "Transferencia/Efectivo: Pagando 60% de anticipo y 40% de saldo antes del envío.",
              },
              {
                title: "Formas de Pago",
                content: (
                  <ul className="list-disc pl-4">
                    <li>Anticipo 60%</li>
                    <li>Saldo 40% Contra entrega</li>
                  </ul>
                ),
              },
              {
                title: "Plazo de entrega",
                content:
                  "De 7 a 20 días hábiles (dependiendo del producto) desde la fecha de pago.",
              },
              {
                title: "Garantía",
                content: "Garantía por errores de fábrica.",
              },
              {
                title: "Validez del presupuesto",
                content:
                  "Presupuesto preliminar sujeto a modificaciones en caso de cambios en las medidas. Validez: 24hs.",
              },
              {
                title: "¿Aceptan Dólares?",
                content:
                  'Sí, aceptamos dólares. Referencia de valor: Precio de venta según "El cronista" al momento del pago.',
              },
              {
                title: "¿Hacen Factura A?",
                content:
                  "Sí, hacemos Factura A o B, es importante mencionarlo antes del pago.",
              },
            ].map((item, index) => (
              <div key={index}>
                <strong>{item.title}:</strong>
                <p>{item.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card className="border-none shadow-md">
        <CardContent className="bg-primary text-primary-foreground text-center py-4">
          <p className="font-semibold">
            SOMOS DECORTINAS S.A.S - CUIT: 30-71765031-6
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
