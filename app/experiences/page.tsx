"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

function ExperiencesContent() {
  const searchParams = useSearchParams()
  const location = searchParams.get("location")
  const date = searchParams.get("date")
  const guests = searchParams.get("guests")

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold text-gris-90">Experiencias Cultripia</h1>
        
        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <p className="text-sm text-gris-80">
            Filtros activos:
            {location && <span className="ml-2">Destino: {location}</span>}
            {date && <span className="ml-2">Fecha: {date}</span>}
            {guests && <span className="ml-2">Huéspedes: {guests}</span>}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-center text-gris-80">Las experiencias se mostrarán aquí</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ExperiencesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExperiencesContent />
    </Suspense>
  )
}