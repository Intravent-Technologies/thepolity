'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Header from '@/components/Header';

interface HomepageImage {
  id: string;
  section: string;
  imageUrl: string;
}

interface SlideshowProps {
  sectionKey: string;
  title: string;
}

export default function Slideshow({ sectionKey, title }: SlideshowProps) {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch('/api/homepage-images')
      .then(res => res.json())
      .then((data: HomepageImage[]) => {
        if (Array.isArray(data)) {
          const filtered = data.filter(img => img.section === sectionKey).map(img => img.imageUrl);
          setImages(filtered);
        }
      })
      .catch(console.error);
  }, [sectionKey]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (images.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#0a0a0a] pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
            <p className="text-white/60">No images uploaded yet. Add images from the admin panel.</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0a0a0a] pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">{title}</h1>
          
          <div className="relative">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              <img 
                src={images[currentIndex]} 
                alt={`Slide ${currentIndex + 1}`} 
                className="w-full h-full object-cover"
              />
            </motion.div>

            {images.length > 1 && (
              <>
                <button 
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-[#FF6B35]' : 'bg-white/50'}`}
                />
              ))}
            </div>

            <div className="absolute top-4 right-4 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          <p className="text-center text-white/60 mt-6">Click image to view fullscreen • Use arrow keys to navigate</p>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black flex items-center justify-center"
              onClick={() => setIsOpen(false)}
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"
              >
                <X className="w-6 h-6" />
              </button>
              
              <img 
                src={images[currentIndex]} 
                alt={`Slide ${currentIndex + 1}`} 
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
