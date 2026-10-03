import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, EffectFade } from 'swiper/modules';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

export function PropertyGallery({ images = [], title = 'Property' }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const displayImages = images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200'];

  return (
    <div className="space-y-3">
      {/* Main Large Carousel */}
      <div className="relative aspect-16/9 w-full overflow-hidden rounded-2xl bg-slate-950 shadow-md">
        <Swiper
          modules={[Navigation, Pagination, Thumbs, EffectFade]}
          effect="fade"
          navigation
          pagination={{ clickable: true }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          onSlideChange={(swiper) => setActiveIdx(swiper.activeIndex)}
          className="h-full w-full"
        >
          {displayImages.map((img, idx) => (
            <SwiperSlide key={idx} className="relative h-full w-full">
              <img
                src={img}
                alt={`${title} - Photo ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Fullscreen Trigger */}
        <button
          type="button"
          onClick={() => setFullscreenOpen(true)}
          className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 rounded-xl bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md hover:bg-slate-900 transition-colors cursor-pointer"
        >
          <Maximize2 className="h-4 w-4" />
          <span>View All ({displayImages.length})</span>
        </button>
      </div>

      {/* Thumbnail Bar */}
      {displayImages.length > 1 && (
        <div className="hidden sm:block">
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={Math.min(displayImages.length, 5)}
            watchSlidesProgress
            className="w-full"
          >
            {displayImages.map((img, idx) => (
              <SwiperSlide key={idx} className="cursor-pointer">
                <div
                  className={`aspect-16/10 overflow-hidden rounded-xl border-2 transition-all ${
                    activeIdx === idx
                      ? 'border-emerald-600 opacity-100 shadow-md scale-95'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {fullscreenOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setFullscreenOpen(false)}
            className="absolute top-6 right-6 z-50 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative max-h-[85vh] max-w-5xl w-full">
            <img
              src={displayImages[activeIdx]}
              alt={`${title} fullscreen`}
              className="max-h-[85vh] w-full object-contain mx-auto rounded-lg"
            />
            <div className="mt-4 flex items-center justify-between text-white text-xs">
              <span>{title}</span>
              <span>{activeIdx + 1} of {displayImages.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
