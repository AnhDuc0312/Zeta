interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  showText?: boolean;
}

export default function Logo({
  size = "md",
  variant = "dark",
  showText = true,
}: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  const iconColor = variant === "dark" ? "text-white" : "text-black";
  const bgColor =
    variant === "dark" ? "bg-black" : "bg-white border border-gray-200";
  const textColor = variant === "dark" ? "text-black" : "text-white";

  return (
    <div className="flex items-center gap-2">
      {/* Logo Icon */}
      <div
        className={`${sizeClasses[size]} ${bgColor} rounded flex items-center justify-center`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`${size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-6 h-6"} ${iconColor}`}
        >
          {/* Z shape with script-like flourish */}
          <path d="M6 4h12v2L10 12l8 6v2H6v-2l8-6L6 6V4z" fill="currentColor" />
          <circle cx="20" cy="8" r="1.5" fill="currentColor" opacity="0.7" />
        </svg>
      </div>

      {/* Text */}
      {showText && (
        <span
          className={`font-bold ${textSizeClasses[size]} ${variant === "dark" ? "text-black" : "text-black"}`}
        >
          ZetaScript
        </span>
      )}
    </div>
  );
}
