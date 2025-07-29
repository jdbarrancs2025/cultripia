"use client"

import { useParams } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { ExperienceDetailContent } from "@/components/experience-detail/ExperienceDetailContent"
import { ExperienceDetailSkeleton } from "@/components/experience-detail/ExperienceDetailSkeleton"

function ExperienceDetail() {
  const params = useParams()
  const experienceId = params.id as Id<"experiences">
  
  const experience = useQuery(api.experiences.getExperience, {
    id: experienceId,
  })
  
  if (experience === null) {
    notFound()
  }
  
  if (!experience) {
    return <ExperienceDetailSkeleton />
  }
  
  return <ExperienceDetailContent experience={experience} />
}

export default function ExperienceDetailPage() {
  return (
    <Suspense fallback={<ExperienceDetailSkeleton />}>
      <ExperienceDetail />
    </Suspense>
  )
}