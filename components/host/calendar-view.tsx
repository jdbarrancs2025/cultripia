"use client"

import { useState } from "react"
import { useUser } from "@/hooks/useUser"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HostCalendar } from "@/components/host/HostCalendar"
import { Badge } from "@/components/ui/badge"
import { Doc, Id } from "@/convex/_generated/dataModel"

export function CalendarView() {
  const { user } = useUser()
  const [selectedExperience, setSelectedExperience] = useState<Id<"experiences"> | null>(null)

  // Fetch host experiences
  const experiences = useQuery(api.experiences.getByHost, 
    user?._id ? { hostId: user._id } : "skip"
  )

  // Fetch availability for selected experience
  const availability = useQuery(
    api.availability.getAvailabilityByExperience,
    selectedExperience ? { experienceId: selectedExperience } : "skip"
  )

  // Fetch bookings for selected experience
  const bookings = useQuery(
    api.bookings.getBookingsByExperience,
    selectedExperience ? { experienceId: selectedExperience } : "skip"
  )

  const handleExperienceChange = (value: string) => {
    setSelectedExperience(value as Id<"experiences">)
  }

  const bookedDates = bookings?.map((booking: any) => booking.selectedDate) || []
  const availabilityMap = new Map(
    availability?.map((a: any) => [a.date, a.status]) || []
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Calendario de Disponibilidad</CardTitle>
          <CardDescription>
            Selecciona una experiencia para ver y gestionar su disponibilidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Experience Selector */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Seleccionar Experiencia
              </label>
              <Select 
                value={selectedExperience || ""} 
                onValueChange={handleExperienceChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Elige una experiencia" />
                </SelectTrigger>
                <SelectContent>
                  {experiences?.map((exp: any) => (
                    <SelectItem key={exp._id} value={exp._id}>
                      {exp.titleEs || exp.titleEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Calendar */}
            {selectedExperience && (
              <>
                <div className="space-y-2">
                  <h3 className="font-medium">Leyenda:</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                      <span className="text-sm">Disponible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                      <span className="text-sm">Bloqueado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                      <span className="text-sm">Reservado</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <HostCalendar experienceId={selectedExperience} />
                </div>

                <div className="text-sm text-gray-600">
                  <p>• Haz clic en las fechas para cambiar su disponibilidad</p>
                  <p>• Las fechas pasadas no se pueden modificar</p>
                  <p>• Las fechas con reservas confirmadas no se pueden bloquear</p>
                </div>
              </>
            )}

            {!selectedExperience && experiences && experiences.length > 0 && (
              <div className="text-center py-8 text-gray-500">
                Selecciona una experiencia para ver su calendario
              </div>
            )}

            {experiences && experiences.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No tienes experiencias creadas. Crea una experiencia primero para gestionar su disponibilidad.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}