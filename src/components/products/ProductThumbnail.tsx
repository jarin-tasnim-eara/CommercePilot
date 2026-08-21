import { cn } from "@/lib/utils/cn";

interface ProductThumbnailProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

export default function ProductThumbnail({
  src,
  alt,
  size = 36,
  className,
}: ProductThumbnailProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- product.thumbnail is an arbitrary admin-pasted URL; next/image requires a fixed remotePatterns allowlist, which is incompatible with unrestricted external hosts.
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={cn("shrink-0 object-cover", className)}
    />
  );
}