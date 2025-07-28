"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Users, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ExperienceCardProps {
  id: string
  title: string
  description: string
  location: string
  maxGuests: number
  hostName: string
  priceUSD: number
  imageUrl: string
}

export function ExperienceCard({
  id,
  title,
  description,
  location,
  maxGuests,
  hostName,
  priceUSD,
  imageUrl,
}: ExperienceCardProps) {
  return (
    <Card className="overflow-hidden transition-transform hover:scale-[1.02]">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={imageUrl || "/images/placeholder-experience.svg"}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-6">
        <h3 className="line-clamp-2 text-xl font-semibold text-gris-90">{title}</h3>
        <p className="line-clamp-3 text-sm text-gris-80">{description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gris-80">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <span>{location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gris-80">
            <Users className="h-4 w-4" aria-hidden="true" />
            <span>Hasta {maxGuests} huéspedes</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gris-80">
            <User className="h-4 w-4" aria-hidden="true" />
            <span>Anfitrión: {hostName}</span>
          </div>
        </div>
        
        <div className="pt-2">
          <span className="text-2xl font-bold text-turquesa">${priceUSD}</span>
          <span className="text-sm text-gris-80"> por persona</span>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full bg-turquesa hover:bg-turquesa/90">
          <Link href={`/experiences/${id}`}>Reserva ahora</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}