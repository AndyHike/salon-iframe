'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLocale } from '@/components/LocaleContext';
import type { GalleryImageItem } from './galleryData';

type GalleryLightboxVariant = 'classic' | 'editorial' | 'minimal';

type GalleryLightboxProps = {
  images: GalleryImageItem[];
  activeIndex: number | null;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
  variant: GalleryLightboxVariant;
};

const variantClasses: Record<GalleryLightboxVariant, {
  closeButton: string;
  navButton: string;
  caption: string;
}> = {
  classic: {
    closeButton: 'rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-stone-950',
    navButton: 'rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-stone-950',
    caption: 'rounded-full bg-stone-950/65 px-4 py-2 text-sm font-medium text-white backdrop-blur',
  },
  editorial: {
    closeButton: 'border border-white/30 bg-stone-950/20 text-white backdrop-blur transition hover:bg-white hover:text-stone-950',
    navButton: 'border border-white/30 bg-stone-950/20 text-white backdrop-blur transition hover:bg-white hover:text-stone-950',
    caption: 'border border-white/20 bg-stone-950/65 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur',
  },
  minimal: {
    closeButton: 'border border-white/25 bg-stone-950/20 text-white backdrop-blur transition hover:bg-white hover:text-stone-950',
    navButton: 'border border-white/25 bg-stone-950/20 text-white backdrop-blur transition hover:bg-white hover:text-stone-950',
    caption: 'border border-white/15 bg-stone-950/65 px-4 py-2 text-sm font-medium text-white backdrop-blur',
  },
};

export function GalleryLightbox({
  images,
  activeIndex,
  onClose,
  onChangeIndex,
  variant,
}: GalleryLightboxProps) {
  const { t } = useLocale();
  const activeImage = activeIndex === null ? null : images[activeIndex];
  const styles = variantClasses[variant];
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    if (!activeImage || activeIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (!hasMultipleImages) return;

      if (event.key === 'ArrowLeft') {
        onChangeIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
      }

      if (event.key === 'ArrowRight') {
        onChangeIndex(activeIndex === images.length - 1 ? 0 : activeIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImage, activeIndex, hasMultipleImages, images.length, onChangeIndex, onClose]);

  if (!activeImage || activeIndex === null) return null;

  const showPrevious = () => {
    onChangeIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
  };

  const showNext = () => {
    onChangeIndex(activeIndex === images.length - 1 ? 0 : activeIndex + 1);
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-stone-950/90 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={activeImage.altText}
      onMouseDown={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        onMouseDown={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
        className={`absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center ${styles.closeButton}`}
        aria-label={t('gallery.close')}
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>

      {hasMultipleImages && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            showPrevious();
          }}
          onMouseDown={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          className={`absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center sm:left-4 sm:h-12 sm:w-12 ${styles.navButton}`}
          aria-label={t('gallery.previousImage')}
        >
          <ChevronLeft className="h-6 w-6" aria-hidden="true" />
        </button>
      )}

      <div
        className="relative h-full max-h-[88vh] w-full max-w-6xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Image
          src={activeImage.filePath}
          alt={activeImage.altText}
          fill
          sizes="100vw"
          className="object-contain"
          referrerPolicy="no-referrer"
        />

        <div className="absolute bottom-4 left-1/2 max-w-[calc(100%-2rem)] -translate-x-1/2">
          <p className={styles.caption}>
            {activeImage.altText}
          </p>
        </div>
      </div>

      {hasMultipleImages && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            showNext();
          }}
          onMouseDown={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          className={`absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center sm:right-4 sm:h-12 sm:w-12 ${styles.navButton}`}
          aria-label={t('gallery.nextImage')}
        >
          <ChevronRight className="h-6 w-6" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
