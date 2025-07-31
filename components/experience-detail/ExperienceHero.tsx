import Image from "next/image";

interface ExperienceHeroProps {
  imageUrl: string;
  title: string;
}

export function ExperienceHero({ imageUrl, title }: ExperienceHeroProps) {
  return (
    <div className="relative h-[60vh] max-h-[600px] overflow-hidden bg-gray-900">
      <Image
        src={imageUrl || "/images/placeholder-experience.svg"}
        alt={title}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  );
}
