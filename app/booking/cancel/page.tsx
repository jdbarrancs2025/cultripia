"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function BookingCancelPage() {
  const router = useRouter()
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">Pago Cancelado</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600">
            Tu reserva no se ha completado. No se ha realizado ningún cargo a tu tarjeta.
          </p>
          
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-800">
                Si experimentaste algún problema durante el proceso de pago, 
                por favor intenta nuevamente o contacta a nuestro equipo de soporte.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => router.back()}
                className="w-full bg-turquesa hover:bg-turquesa/90"
              >
                Intentar de nuevo
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link href="/experiences">
                  Explorar experiencias
                </Link>
              </Button>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mt-6">
            Si necesitas ayuda, contáctanos en{" "}
            <a href="mailto:support@cultripia.com" className="text-turquesa hover:underline">
              support@cultripia.com
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}