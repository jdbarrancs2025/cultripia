import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-12 pb-8 text-center space-y-4">
          <h2 className="text-3xl font-bold text-gris-90">
            Experiencia no encontrada
          </h2>
          <p className="text-gris-80">
            Lo sentimos, no pudimos encontrar la experiencia que buscas.
          </p>
          <div className="pt-4">
            <Button asChild className="bg-turquesa hover:bg-turquesa/90">
              <Link href="/experiences">
                Explorar experiencias
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}