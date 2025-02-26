import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ValidationAlertProps {
  message: string | undefined;
}

const ValidationAlert = ({ message }: ValidationAlertProps) => {
  return (
    <Alert variant="destructive" className="mb-2">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="font-bold">Cuidado</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default ValidationAlert;
