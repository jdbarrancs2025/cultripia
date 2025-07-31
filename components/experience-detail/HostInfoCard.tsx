import { User, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Doc } from "@/convex/_generated/dataModel";

interface HostInfoCardProps {
  host: Doc<"users">;
}

export function HostInfoCard({ host }: HostInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Conoce a tu anfitrión</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-turquesa/10">
            <User className="h-8 w-8 text-turquesa" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gris-90">{host.name}</h3>
            <p className="text-sm text-gris-80">Anfitrión verificado</p>
          </div>
        </div>

        <div className="space-y-2 rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gris-80">
            {host.name} es un anfitrión local apasionado por compartir
            experiencias culturales auténticas con viajeros de todo el mundo.
          </p>
        </div>

        <Button
          variant="outline"
          className="w-full border-turquesa text-turquesa hover:bg-turquesa/10"
          disabled
        >
          <Mail className="mr-2 h-4 w-4" />
          Contactar anfitrión (próximamente)
        </Button>
      </CardContent>
    </Card>
  );
}
