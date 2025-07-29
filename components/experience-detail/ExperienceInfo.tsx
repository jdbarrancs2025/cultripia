import { MapPin, Users, Calendar, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ExperienceInfoProps {
  title: string
  description: string
  location: string
  maxGuests: number
}

export function ExperienceInfo({ 
  title, 
  description, 
  location, 
  maxGuests 
}: ExperienceInfoProps) {
  return (
    <div className="space-y-6">
      {/* Title and Location */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-gris-90 lg:text-4xl">
          {title}
        </h1>
        <div className="flex items-center gap-2 text-gris-80">
          <MapPin className="h-5 w-5" aria-hidden="true" />
          <span className="text-lg">{location}</span>
        </div>
      </div>
      
      {/* Quick Info */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-turquesa/20">
          <CardContent className="flex items-center gap-2 p-4">
            <Users className="h-5 w-5 text-turquesa" />
            <div>
              <p className="text-sm text-gris-80">Capacidad</p>
              <p className="font-semibold text-gris-90">
                Hasta {maxGuests} personas
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-turquesa/20">
          <CardContent className="flex items-center gap-2 p-4">
            <Clock className="h-5 w-5 text-turquesa" />
            <div>
              <p className="text-sm text-gris-80">Duración</p>
              <p className="font-semibold text-gris-90">
                Por definir
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-turquesa/20">
          <CardContent className="flex items-center gap-2 p-4">
            <Calendar className="h-5 w-5 text-turquesa" />
            <div>
              <p className="text-sm text-gris-80">Disponibilidad</p>
              <p className="font-semibold text-gris-90">
                Ver calendario
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Description */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gris-90">
          Acerca de esta experiencia
        </h2>
        <div className="prose prose-gray max-w-none">
          <p className="whitespace-pre-wrap text-gris-80 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      
      {/* What's Included (placeholder for future enhancement) */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gris-90">
          ¿Qué está incluido?
        </h2>
        <Card className="bg-turquesa/5 border-turquesa/20">
          <CardContent className="p-6">
            <p className="text-gris-80">
              Esta información será proporcionada por el anfitrión próximamente.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}