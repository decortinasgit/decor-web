import { type Metadata } from "next";
import { env } from "@/env.js";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shell } from "@/components/shell";
import { ForgotFormConfirm } from "@/app/(auth)/_components/forgot-form-confirm";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Restaurar contraseña",
  description: "Ingresa tu código para restaurar la contraseña",
};

export default function ResetPasswordConfirmPage() {
  return (
    <Shell className="max-w-lg">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Restaurar contraseña</CardTitle>
          <CardDescription>
            Ingresa el código de verificación que enviamos a tu mail y tu nueva
            contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotFormConfirm />
        </CardContent>
      </Card>
    </Shell>
  );
}
