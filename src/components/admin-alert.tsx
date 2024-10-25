import React from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

type Props = {}

const AdminAlert = (props: Props) => {
    return (
        <Alert className='max-h-fit'>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Lo siento!</AlertTitle>
            <AlertDescription>
                Solo un <span>administrador</span> puede acceder a esta funcionalidad.
            </AlertDescription>
        </Alert>
    )
}

export default AdminAlert