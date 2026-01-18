'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLightStore } from '@/store/useLightStore'

interface LightboxProps {
  images: string[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
  onGoToSlide: (index: number) => void
  alt: string
}

export default function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  onGoToSlide,
  alt,
}: LightboxProps) {
  const isLightOn = useLightStore((state) => state.isLightOn)

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        onPrevious()
      } else if (e.key === 'ArrowRight') {
        onNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, onNext, onPrevious])

  if (!isOpen || !images[currentIndex]) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          >
            {/* Lightbox Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-7xl max-h-[90vh] w-full"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className={`absolute top-4 right-4 z-10 border-2 border-black px-4 py-2 font-mono font-bold uppercase text-sm transition-colors ${
                  isLightOn 
                    ? 'bg-white text-black hover:bg-black hover:text-white' 
                    : 'bg-black text-white hover:bg-white hover:text-black'
                }`}
                aria-label="Close lightbox"
              >
                CLOSE ×
              </button>

              {/* Main Image */}
              <div className={`relative border-2 border-black ${
                isLightOn ? 'bg-white' : 'bg-black'
              }`}>
                <motion.img
                  key={currentIndex}
                  src={images[currentIndex]}
                  alt={`${alt} - Image ${currentIndex + 1}`}
                  className="max-h-[90vh] w-full object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={onPrevious}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 border-2 border-black px-4 py-3 font-mono font-bold uppercase text-lg transition-colors ${
                        isLightOn 
                          ? 'bg-white text-black hover:bg-black hover:text-white' 
                          : 'bg-black text-white hover:bg-white hover:text-black'
                      }`}
                      aria-label="Previous image"
                    >
                      ←
                    </button>
                    <button
                      onClick={onNext}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 border-2 border-black px-4 py-3 font-mono font-bold uppercase text-lg transition-colors ${
                        isLightOn 
                          ? 'bg-white text-black hover:bg-black hover:text-white' 
                          : 'bg-black text-white hover:bg-white hover:text-black'
                      }`}
                      aria-label="Next image"
                    >
                      →
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className={`absolute bottom-4 right-4 border-2 border-black px-4 py-2 ${
                    isLightOn ? 'bg-white text-black' : 'bg-black text-white'
                  }`}>
                    <span className="text-sm font-mono font-bold uppercase">
                      {currentIndex + 1} / {images.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => onGoToSlide(index)}
                      className={`flex-shrink-0 w-24 h-24 overflow-hidden border-2 transition-all ${
                        index === currentIndex
                          ? 'border-black shadow-hard'
                          : 'border-black opacity-60 hover:opacity-100'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    >
                      <img
                        src={image}
                        alt={`${alt} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
