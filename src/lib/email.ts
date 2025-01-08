import nodemailer from "nodemailer";
import { env } from "@/env";

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!to || !subject || !text || !html) {
      throw new Error("Missing required fields.");
    }

    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: parseInt(env.SMTP_PORT, 10),
      secure: env.SMTP_SECURE === "true",
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Decortinas" <${env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || "Failed to send email." };
  }
}
