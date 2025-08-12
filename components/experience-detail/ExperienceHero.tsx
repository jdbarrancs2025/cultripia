import Image from "next/image";

interface ExperienceHeroProps {
  imageUrl: string;
  title: string;
}

export function ExperienceHero({ 
  imageUrl, 
  title
}: ExperienceHeroProps) {
  return (
    <div className="relative h-[60vh] max-h-[600px] overflow-hidden bg-gray-900">
      <div className="h-full w-full">
        <Image
          src={imageUrl || "/images/placeholder-experience.svg"}
          alt={title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  );
}
