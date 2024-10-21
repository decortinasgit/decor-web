import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface LoadingDialogProps {
  open: boolean
  title?: string
  description?: string
}

export function LoadingDialog({
  open,
  title,
  description,
}: LoadingDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader>
          <DialogTitle>{title ?? "Cargando..."}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {description ??
            "Puede que lleve unos minutos. Por favor aguarde y no cierre la ventana."}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
