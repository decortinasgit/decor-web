"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Toaster } from "@/components/ui/toaster";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";

export default function SupportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await axios.post("/api/contact", {
        to: "distribuidoresdecortinas@gmail.com",
        subject: `#Soporte de ${formData.get("name")}`,
        text: `Tipo de consulta: ${formData.get("type")}\n\n${formData.get(
          "message"
        )}`,
        html: `
          <p><strong>Nombre:</strong> ${formData.get("name")}</p>
          <p><strong>Email:</strong> ${formData.get("email")}</p>
          <p><strong>Tipo de consulta:</strong> ${formData.get("type")}</p>
          <p><strong>Mensaje:</strong> ${formData.get("message")}</p>
        `,
      });

      if (response.status === 200) {
        toast.success("Mensaje enviado", {
          description: "Gracias por tus comentarios. Te responderemos pronto.",
        });
        // Reset form
        event.currentTarget.reset();
      } else {
        throw new Error("Error al enviar el formulario");
      }
    } catch (error) {
      toast.error("Error", {
        description:
          "Hubo un problema al enviar tu mensaje. Por favor intenta nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Centro de Ayuda</CardTitle>
        <CardDescription>
          Envíanos tus dudas o comentarios y te responderemos lo antes posible.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" placeholder="Tu nombre" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de consulta</Label>
            <Select name="type" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Problema técnico</SelectItem>
                <SelectItem value="billing">Facturación</SelectItem>
                <SelectItem value="feature">Sugerencia</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Mensaje</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Describe tu consulta en detalle..."
              className="min-h-[100px]"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar mensaje"}
          </Button>
        </CardFooter>
      </form>
      <Toaster />
    </Card>
  );
}
