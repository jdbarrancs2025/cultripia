"use client"

import { useState } from "react"
import { TravelerDatePicker } from "@/components/booking/TravelerDatePicker"
import { HostCalendar } from "@/components/host/HostCalendar"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

export default function TestCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  
  // Get first active experience for testing
  const experiences = useQuery(api.experiences.getExperiences, {
    status: "active"
  })
  
  const firstExperience = experiences?.[0]
  const experienceId = firstExperience?._id

  if (!experienceId) {
    return (
      <div className="container mx-auto p-8">
        <p>No active experiences found for testing. Please create an active experience first.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Calendar Components Test</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Host Calendar</h2>
          <p className="text-gray-600 mb-4">This is how hosts manage availability:</p>
          <HostCalendar experienceId={experienceId as Id<"experiences">} />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Traveler Date Picker</h2>
          <p className="text-gray-600 mb-4">This is how travelers select dates:</p>
          <TravelerDatePicker 
            experienceId={experienceId as Id<"experiences">}
            onDateSelect={setSelectedDate}
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </div>
  )
}