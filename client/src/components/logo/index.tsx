import { AudioWaveform } from "lucide-react";
import { Link } from "react-router-dom";
import defaultLogo from "@/assets/logo.png"; // الصورة الافتراضية

interface LogoProps {
  url?: string;
  src?: string; // صورة مخصصة لو حبيت تمرر
  alt?: string;
}

const Logo = ({ url = "/", src, alt = "Logo" }: LogoProps) => {
  const logoSrc = src || defaultLogo;

  return (
    <div className="flex items-center justify-center sm:justify-start">
      <Link to={url}>
        <div className="flex h-10 w-10 items-center justify-center rounded-md overflow-hidden bg-primary">
          {logoSrc ? (
            <img
              src={logoSrc}
              alt={alt}
              className="h-full w-full object-contain"
            />
          ) : (
            <AudioWaveform className="size-4 text-primary-foreground" />
          )}
        </div>
      </Link>
    </div>
  );
};

export default Logo;
