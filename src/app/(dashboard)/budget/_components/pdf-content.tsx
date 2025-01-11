import { OrderItem } from "@/db/schema";
import { totalAmount } from "@/lib/curtains";
import { CurtainsTable } from "./curtains-table/curtains-table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { CurtainsTablePDF } from "./curtains-table/curtains-table-pdf";

interface PDFContentProps {
  curtains: Array<OrderItem> | undefined;
  clientName: string;
  quoteDate: string;
}

export function PDFContent({
  curtains,
  clientName,
  quoteDate,
}: PDFContentProps) {
  if (!curtains) {
    return (
      <div id="pdf-content" className="p-4 bg-white">
        <h3>No puedes enviar un presupuesto vacío</h3>
      </div>
    );
  }

  return (
    <div id="pdf-content" className="p-4 bg-white">
      {/* Header */}
      <Card className="mb-6">
        <CardHeader className="bg-white text-center">
          <div className={`flex items-center gap-2`}>
            <Icons.logo className="size-9" />
            <div className={`flex flex-col items-center`}>
              <span className="font-medium">Decortinas</span>
              <span className="text-xs">Distribuidores</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Cliente:</strong> {clientName}
          </p>
          <p>
            <strong>Fecha del presupuesto:</strong> {quoteDate}
          </p>
        </CardContent>
      </Card>

      {/* Curtains Table */}

      <CurtainsTablePDF curtains={curtains} />

      {/* Static FAQ Section */}
      <Card className="my-6">
        <CardHeader>
          <h3>PREGUNTAS FRECUENTES:</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm leading-6">
            <div>
              <strong>Métodos de Pago:</strong>
              <p>
                Transferencia/Efectivo: Pagando 60% de anticipo y 40% de saldo
                antes del envío.
              </p>
            </div>
            <div>
              <strong>Formas de Pago:</strong>
              <ul className="list-disc pl-4">
                <li>Anticipo 60%</li>
                <li>Saldo 40% Contra entrega</li>
              </ul>
            </div>
            <div>
              <strong>Plazo de entrega:</strong>
              <p>
                De 7 a 20 días hábiles (dependiendo del producto) desde la fecha
                de pago.
              </p>
            </div>
            <div>
              <strong>Garantía:</strong>
              <p>Garantía por errores de fábrica.</p>
            </div>
            <div>
              <strong>Validez del presupuesto:</strong>
              <p>
                Presupuesto preliminar sujeto a modificaciones en caso de
                cambios en las medidas. Validez: 24hs.
              </p>
            </div>
            <div>
              <strong>¿Aceptan Dólares?</strong>
              <p>
                Sí, aceptamos dólares. Referencia de valor: Precio de venta
                según &ldquo;El cronista&ldquo; al momento del pago.
              </p>
            </div>
            <div>
              <strong>¿Hacen Factura A?</strong>
              <p>
                Sí, hacemos Factura A o B, es importante mencionarlo antes del
                pago.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card>
        <CardContent className="bg-primary flex items-center justify-center text-center py-4">
          <p className="text-foreground font-semibold">
            SOMOS DECORTINAS S.A.S - CUIT: 30-71765031-6
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
