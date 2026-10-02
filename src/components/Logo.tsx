import Image from "next/image";

const DIMENSIONS = { width: 984, height: 211 };

/* The logo is a dark navy wordmark with a blue accent, so it needs a light
   variant on the dark navy footer.

   The image is absolutely positioned inside a wrapper whose width comes from
   an explicit aspect-ratio, and whose height is set by className. That keeps
   the two dimensions tied to each other by the browser rather than by a
   separate width utility — an `h-8` with no matching `w-auto` renders at the
   full 984px intrinsic width and blows the header layout apart, which is
   exactly what happened before. */
export default function Logo({
  variant = "dark",
  className = "h-10",
}: {
  variant?: "dark" | "inverse";
  className?: string;
}) {
  return (
    <span
      className={`relative block ${className}`}
      style={{ aspectRatio: `${DIMENSIONS.width} / ${DIMENSIONS.height}` }}
    >
      <Image
        src={variant === "inverse" ? "/logo-inverse.png" : "/logo.png"}
        alt="The Polity"
        fill
        sizes="187px"
        className="object-contain"
        priority
      />
    </span>
  );
}
