import type { CmsImage as CmsImageData } from '@/cms/types';

/**
 * Admin-hosted media, rendered as a plain `<img>`.
 *
 * This replaces `next/image` for CMS images, and the reason is not performance
 * dogma: the admin now supplies a finished `srcset` across its own delivery
 * ladder. `next/image` exists to *generate* one, so at its defaults it would
 * invent a second, different width set — multiplying the number of image
 * variants the admin pays for, to arrive at the same picture. A custom loader
 * would only re-derive what already arrived in the payload.
 *
 * `unoptimized` is not the alternative: it drops `srcset` along with the CPU
 * cost, which is worse than either option.
 *
 * Two things `next/image` was doing for free have to be done by hand here, and
 * both are one line: `loading="lazy"` (the default below, opt out with
 * `priority`), and `fill`, which is ordinary absolute positioning.
 *
 * **`sizes` is a required prop, deliberately.** It is the one thing the admin
 * cannot compute — only whoever wrote the CSS knows how much layout space the
 * image occupies — and a `srcset` rendered without it makes the browser assume
 * the full viewport width and take the largest rung for every image on the
 * page. That failure renders perfectly and is invisible until someone reads a
 * bill, so the type system is the right place to catch it.
 */
export function CmsImage({
  image,
  alt,
  sizes,
  className = '',
  /** `next/image`'s `fill`: stretch to the nearest positioned ancestor. */
  fill = false,
  priority = false,
}: {
  image: Pick<CmsImageData, 'filePath' | 'srcset' | 'width' | 'height'>;
  alt: string;
  sizes: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
}) {
  return (
    <img
      src={image.filePath}
      srcSet={image.srcset ?? undefined}
      sizes={sizes}
      // Intrinsic dimensions let the browser reserve layout space before the
      // bytes arrive. Absent for images uploaded before the admin recorded
      // them, and omitted rather than faked - a wrong ratio is worse than none.
      // Under `fill` they are left off entirely: the container owns the box.
      width={fill ? undefined : image.width ?? undefined}
      height={fill ? undefined : image.height ?? undefined}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      referrerPolicy="no-referrer"
      alt={alt}
      className={fill ? `absolute inset-0 h-full w-full ${className}` : className}
    />
  );
}
