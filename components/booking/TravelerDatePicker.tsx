"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TravelerDatePickerProps {
  experienceId: Id<"experiences">;
  onDateSelect: (date: Date | undefined) => void;
  selectedDate?: Date;
}

export function TravelerDatePicker({
  experienceId,
  onDateSelect,
  selectedDate,
}: TravelerDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth() + 1;

  // Fetch availability for current month
  const monthAvailability = useQuery(api.availability.getAvailabilityForMonth, {
    experienceId,
    year,
    month,
  });

  // Create a set of available dates for quick lookup
  // A date is available if it has remaining capacity and is not blocked
  const availableDates = new Set<string>();
  const dateCapacityMap = new Map<string, { remaining: number; booked: number; max: number }>();

  monthAvailability?.dates.forEach((dateInfo) => {
    if (dateInfo.status !== "blocked" && dateInfo.remainingCapacity > 0) {
      availableDates.add(dateInfo.date);
    }
    dateCapacityMap.set(dateInfo.date, {
      remaining: dateInfo.remainingCapacity,
      booked: dateInfo.bookedGuests,
      max: dateInfo.maxGuests,
    });
  });

  const isDateAvailable = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return availableDates.has(dateStr);
  };

  const isDateDisabled = (date: Date) => {
    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // Disable if not available
    return !isDateAvailable(date);
  };

  const modifiers = {
    available: (date: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today && isDateAvailable(date);
    },
    lowCapacity: (date: Date) => {
      const dateStr = date.toISOString().split("T")[0];
      const capacity = dateCapacityMap.get(dateStr);
      if (!capacity) return false;
      const percentRemaining = (capacity.remaining / capacity.max) * 100;
      return percentRemaining > 0 && percentRemaining <= 30;
    },
    unavailable: (date: Date) => {
      const dateStr = date.toISOString().split("T")[0];
      const dateInfo = monthAvailability?.dates.find((d) => d.date === dateStr);
      const capacity = dateCapacityMap.get(dateStr);
      return !!(
        dateInfo &&
        (dateInfo.status === "blocked" || (capacity && capacity.remaining <= 0))
      );
    },
    past: (date: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    },
  };

  const modifiersClassNames = {
    available:
      "bg-turquesa/10 hover:bg-turquesa/20 text-turquesa-dark cursor-pointer",
    lowCapacity:
      "bg-yellow-50 hover:bg-yellow-100 text-yellow-900 cursor-pointer border border-yellow-300",
    unavailable: "bg-gray-100 text-gray-400 cursor-not-allowed line-through",
    past: "opacity-50 cursor-not-allowed",
    selected: "bg-turquesa text-white hover:bg-turquesa/90",
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarIcon className="h-5 w-5" />
          Selecciona una fecha
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-turquesa/10 border border-turquesa/20" />
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-yellow-50 border border-yellow-300" />
            <span>Pocos espacios</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-gray-100" />
            <span>No disponible</span>
          </div>
        </div>

        {/* Calendar */}
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            disabled={isDateDisabled}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            showOutsideDays={false}
            className="rounded-md border"
            components={{
              DayButton: ({ className, day, modifiers, ...props }) => {
                const isAvailable =
                  day.date >= new Date(new Date().setHours(0, 0, 0, 0)) &&
                  isDateAvailable(day.date);
                const dateStr = day.date.toISOString().split("T")[0];
                const capacity = dateCapacityMap.get(dateStr);
                const dateInfo = monthAvailability?.dates.find(
                  (d) => d.date === dateStr,
                );
                const isFull = capacity && capacity.remaining <= 0;
                const isBlocked = dateInfo?.status === "blocked";
                const isLowCapacity =
                  capacity && capacity.remaining > 0 && capacity.remaining <= Math.max(3, capacity.max * 0.3);

                return (
                  <Button
                    {...props}
                    variant="ghost"
                    size="icon"
                    disabled={!isAvailable || isFull || isBlocked}
                    className={cn(
                      "h-9 w-9 p-0 font-normal aria-selected:opacity-100 relative",
                      className,
                    )}
                  >
                    <span>{day.date.getDate()}</span>
                    {isFull && (
                      <span className="absolute bottom-0 text-[10px] text-gray-400">
                        ×
                      </span>
                    )}
                    {isLowCapacity && capacity && (
                      <span className="absolute bottom-0 text-[10px] text-yellow-700 font-semibold">
                        {capacity.remaining}
                      </span>
                    )}
                  </Button>
                );
              },
            }}
          />
        </div>

        {selectedDate && (
          <div className="bg-turquesa/10 rounded-lg p-3 text-center">
            <p className="text-sm font-medium text-turquesa-dark">
              Fecha seleccionada:
            </p>
            <p className="text-lg font-semibold text-gris-90">
              {selectedDate.toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        )}

        {!selectedDate && (
          <p className="text-sm text-gris-80 text-center">
            Por favor selecciona una fecha disponible para continuar con tu
            reserva.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
