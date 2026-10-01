import Image from "next/image";

const DIMENSIONS = { width: 984, height: 211 };

/* The logo is a dark navy wordmark with a blue accent, so it needs a light
   variant on the dark navy footer. Set the height with className (e.g. h-7);
   the width follows from the 984x211 aspect ratio. */
export default function Logo({
  variant = "dark",
  className = "h-7",
}: {
  variant?: "dark" | "inverse";
  className?: string;
}) {
  return (
    <Image
      src={variant === "inverse" ? "/logo-inverse.png" : "/logo.png"}
      alt="The Polity"
      width={DIMENSIONS.width}
      height={DIMENSIONS.height}
      className={`${className} w-auto`}
      priority
    />
  );
}
