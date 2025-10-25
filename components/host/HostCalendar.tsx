"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { CalendarIcon, CheckIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface HostCalendarProps {
  experienceId: Id<"experiences">;
}

export function HostCalendar({ experienceId }: HostCalendarProps) {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth() + 1;

  // Fetch availability for current month
  const monthAvailability = useQuery(api.availability.getAvailabilityForMonth, {
    experienceId,
    year,
    month,
  });

  const updateAvailability = useMutation(
    api.availability.updateAvailabilityStatus,
  );
  const bulkUpdateAvailability = useMutation(
    api.availability.bulkUpdateAvailability,
  );

  // Create a map of date status and capacity for quick lookup
  const availabilityMap = new Map<
    string,
    {
      status: "available" | "blocked" | "booked";
      bookedGuests: number;
      remainingCapacity: number;
      maxGuests: number;
    }
  >();
  monthAvailability?.dates.forEach((dateInfo) => {
    availabilityMap.set(dateInfo.date, {
      status: dateInfo.status,
      bookedGuests: dateInfo.bookedGuests,
      remainingCapacity: dateInfo.remainingCapacity,
      maxGuests: dateInfo.maxGuests,
    });
  });

  const handleDateClick = async (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    const dateInfo = availabilityMap.get(dateStr);
    const currentStatus = dateInfo?.status || "available";

    // Don't allow changing dates with bookings
    if (dateInfo && dateInfo.bookedGuests > 0) {
      toast.error(`No puedes modificar esta fecha. Tiene ${dateInfo.bookedGuests} reservas activas.`);
      return;
    }

    // Don't allow changing past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      toast.error("No puedes modificar fechas pasadas");
      return;
    }

    // If shift key is held, handle range selection
    if (rangeStart && date > rangeStart) {
      handleRangeSelection(rangeStart, date);
      setRangeStart(null);
      return;
    }

    // Toggle status for single date
    const newStatus = currentStatus === "available" ? "blocked" : "available";

    try {
      await updateAvailability({
        experienceId,
        date: dateStr,
        status: newStatus,
      });
      toast.success(
        `Fecha ${newStatus === "available" ? "habilitada" : "bloqueada"}`,
      );
    } catch (error) {
      toast.error("Error al actualizar disponibilidad");
    }
  };

  const handleRangeSelection = async (start: Date, end: Date) => {
    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];

    try {
      const result = await bulkUpdateAvailability({
        experienceId,
        startDate: startStr,
        endDate: endStr,
        status: "blocked",
      });
      toast.success(`${result.updated} fechas bloqueadas`);
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar disponibilidad");
    }
  };

  const handleBlockSelected = async () => {
    if (selectedDates.length === 0) {
      toast.error("Selecciona fechas para bloquear");
      return;
    }

    const dates = selectedDates
      .map((d) => d.toISOString().split("T")[0])
      .sort();
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];

    try {
      const result = await bulkUpdateAvailability({
        experienceId,
        startDate,
        endDate,
        status: "blocked",
      });
      toast.success(`${result.updated} fechas bloqueadas`);
      setSelectedDates([]);
    } catch (error: any) {
      toast.error(error.message || "Error al bloquear fechas");
    }
  };

  const handleUnblockSelected = async () => {
    if (selectedDates.length === 0) {
      toast.error("Selecciona fechas para desbloquear");
      return;
    }

    const dates = selectedDates
      .map((d) => d.toISOString().split("T")[0])
      .sort();
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];

    try {
      const result = await bulkUpdateAvailability({
        experienceId,
        startDate,
        endDate,
        status: "available",
      });
      toast.success(`${result.updated} fechas habilitadas`);
      setSelectedDates([]);
    } catch (error: any) {
      toast.error(error.message || "Error al desbloquear fechas");
    }
  };

  const modifiers = {
    available: (date: Date) => {
      const dateStr = date.toISOString().split("T")[0];
      const dateInfo = availabilityMap.get(dateStr);
      return dateInfo === undefined || (dateInfo.status === "available" && dateInfo.bookedGuests === 0);
    },
    partiallyBooked: (date: Date) => {
      const dateStr = date.toISOString().split("T")[0];
      const dateInfo = availabilityMap.get(dateStr);
      return dateInfo !== undefined && dateInfo.bookedGuests > 0 && dateInfo.remainingCapacity > 0;
    },
    blocked: (date: Date) => {
      const dateStr = date.toISOString().split("T")[0];
      const dateInfo = availabilityMap.get(dateStr);
      return dateInfo?.status === "blocked";
    },
    booked: (date: Date) => {
      const dateStr = date.toISOString().split("T")[0];
      const dateInfo = availabilityMap.get(dateStr);
      return dateInfo !== undefined && dateInfo.remainingCapacity <= 0;
    },
    selected: selectedDates,
    past: (date: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    },
  };

  const modifiersClassNames = {
    available: "hover:bg-turquesa/10 cursor-pointer",
    partiallyBooked: "bg-yellow-50 text-yellow-900 border border-yellow-300",
    blocked: "bg-gray-100 text-gray-500 hover:bg-gray-200",
    booked: "bg-red-100 text-red-700 cursor-not-allowed",
    selected: "ring-2 ring-turquesa",
    past: "opacity-50 cursor-not-allowed",
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Gestionar Disponibilidad
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-white border border-gray-300" />
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-gray-100" />
            <span>Bloqueado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-red-100" />
            <span>Reservado</span>
          </div>
        </div>

        {/* Calendar */}
        <div className="flex justify-center">
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={(dates) => setSelectedDates(dates || [])}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            showOutsideDays={false}
            className="rounded-md border"
            components={{
              DayButton: ({ className, day, modifiers, ...props }) => {
                const dateStr = day.date.toISOString().split("T")[0];
                const dateInfo = availabilityMap.get(dateStr);
                const hasBookings = dateInfo && dateInfo.bookedGuests > 0;
                const isPast =
                  day.date < new Date(new Date().setHours(0, 0, 0, 0));

                return (
                  <Button
                    {...props}
                    variant="ghost"
                    size="icon"
                    disabled={hasBookings || isPast}
                    onClick={() =>
                      !hasBookings && !isPast && handleDateClick(day.date)
                    }
                    className={cn(
                      "h-9 w-9 p-0 font-normal aria-selected:opacity-100 relative",
                      className,
                    )}
                  >
                    <span>{day.date.getDate()}</span>
                    {dateInfo && dateInfo.bookedGuests > 0 && (
                      <span className="absolute bottom-0 text-[9px] text-gray-600 font-semibold">
                        {dateInfo.bookedGuests}/{dateInfo.maxGuests}
                      </span>
                    )}
                  </Button>
                );
              },
            }}
          />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleBlockSelected}
            variant="outline"
            className="flex-1"
            disabled={selectedDates.length === 0}
          >
            <XIcon className="mr-2 h-4 w-4" />
            Bloquear Seleccionadas
          </Button>
          <Button
            onClick={handleUnblockSelected}
            variant="outline"
            className="flex-1"
            disabled={selectedDates.length === 0}
          >
            <CheckIcon className="mr-2 h-4 w-4" />
            Habilitar Seleccionadas
          </Button>
        </div>

        <p className="text-sm text-gris-80">
          Haz clic en las fechas para cambiar su disponibilidad. Selecciona
          múltiples fechas para acciones en lote. Las fechas reservadas no se
          pueden modificar.
        </p>
      </CardContent>
    </Card>
  );
}
