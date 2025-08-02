  import { useRef, useState, useEffect } from "react";
  import { ChevronLeft, ChevronRight } from "lucide-react";

  const ImageCarousel = ({ images = [], showIndicators = true }) => {
    const containerRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const scrollToIndex = (index) => {
      const container = containerRef.current;
      if (!container || !container.children[index]) return;

      const child = container.children[index];
      container.scrollTo({
        left: child.offsetLeft,
        behavior: "smooth",
      });
    };

    const handlePrev = () => {
      if (currentIndex > 0) {
        scrollToIndex(currentIndex - 1);
      }
    };

    const handleNext = () => {
      if (currentIndex < images.length - 1) {
        scrollToIndex(currentIndex + 1);
      }
    };

    // Sync index based on scroll
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleScroll = () => {
        const scrollLeft = container.scrollLeft;
        const childWidth = container.offsetWidth;
        const index = Math.round(scrollLeft / childWidth);
        setCurrentIndex(index);
      };

      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    return (
      <div className="relative w-full overflow-hidden rounded-xl">
        <div
          ref={containerRef}
          className="flex no-scrollbar overflow-x-scroll snap-x snap-mandatory scroll-smooth"
        >
          {images.map((url, idx) => (
            <div
              key={idx}
              className="w-full shrink-0 snap-start aspect-video overflow-hidden"
            >
              <img
                src={url}
                alt={`image-${idx}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Left arrow */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`absolute cursor-pointer top-0 left-0 h-full w-[30%] flex items-center justify-start z-10 group ${
            currentIndex === 0 ? "pointer-events-none opacity-30" : ""
          }`}
        >
          <ChevronLeft className="h-8 w-8 text-white group-hover:opacity-100 opacity-0 transition-opacity duration-200" />
        </button>

        {/* Right arrow */}
        <button
          onClick={handleNext}
          disabled={currentIndex >= images.length - 1}
          className={`absolute cursor-pointer top-0 right-0 h-full w-[30%] flex items-center justify-end z-10 group ${
            currentIndex >= images.length - 1
              ? "pointer-events-none opacity-30"
              : ""
          }`}
        >
          <ChevronRight className="h-8 w-8 text-white group-hover:opacity-100 opacity-0 transition-opacity duration-200" />
        </button>

        {/* Indicators */}
        {showIndicators && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx === currentIndex ? "bg-white" : "bg-white/50"
                } transition-all duration-200`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  export default ImageCarousel;
