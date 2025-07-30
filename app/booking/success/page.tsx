"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAction, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Calendar, Users, MapPin, Mail } from "lucide-react"
import Link from "next/link"

function BookingSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get("session_id")
  const [isLoading, setIsLoading] = useState(true)
  
  const booking = useQuery(
    api.bookings.getBySessionId,
    sessionId ? { sessionId } : "skip"
  )
  
  useEffect(() => {
    if (!sessionId) {
      router.push("/")
    }
  }, [sessionId, router])
  
  useEffect(() => {
    if (booking !== undefined) {
      setIsLoading(false)
    }
  }, [booking])
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-turquesa border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Confirmando tu reserva...</p>
        </div>
      </div>
    )
  }
  
  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <p className="text-gray-600 mb-4">No se encontró la reserva.</p>
            <Button asChild>
              <Link href="/">Volver al inicio</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString('es', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Reserva Confirmada!
          </h1>
          <p className="text-gray-600">
            Tu pago ha sido procesado exitosamente
          </p>
        </div>
        
        {/* Booking Details Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Detalles de tu reserva</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Experience Info */}
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {booking.experience?.titleEs}
              </h3>
              <p className="text-gray-600">
                {booking.experience?.descEs}
              </p>
            </div>
            
            {/* Booking Details */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-turquesa mt-0.5" />
                <div>
                  <p className="font-medium">Fecha</p>
                  <p className="text-gray-600">
                    {formatDate(booking.selectedDate)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-turquesa mt-0.5" />
                <div>
                  <p className="font-medium">Número de personas</p>
                  <p className="text-gray-600">
                    {booking.qtyPersons} {booking.qtyPersons === 1 ? 'persona' : 'personas'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-turquesa mt-0.5" />
                <div>
                  <p className="font-medium">Ubicación</p>
                  <p className="text-gray-600">
                    {booking.experience?.location}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-turquesa mt-0.5" />
                <div>
                  <p className="font-medium">Anfitrión</p>
                  <p className="text-gray-600">
                    {booking.host?.name}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Payment Info */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total pagado</span>
                <span className="text-2xl font-bold text-turquesa">
                  ${booking.totalAmount} USD
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Próximos pasos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-turquesa/10 text-turquesa flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <p className="font-medium">Revisa tu correo electrónico</p>
                <p className="text-sm text-gray-600">
                  Recibirás un correo de confirmación con todos los detalles de tu reserva.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-turquesa/10 text-turquesa flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <p className="font-medium">Contacta a tu anfitrión</p>
                <p className="text-sm text-gray-600">
                  Tu anfitrión se pondrá en contacto contigo para coordinar los detalles de la experiencia.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-turquesa/10 text-turquesa flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <p className="font-medium">Disfruta tu experiencia</p>
                <p className="text-sm text-gray-600">
                  Prepárate para vivir una experiencia cultural única e inolvidable.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard">Ver mis reservas</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/experiences">Explorar más experiencias</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-turquesa border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  )
}