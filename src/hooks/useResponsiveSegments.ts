// src/hooks/useResponsiveSegments.ts
import { useState, useEffect } from "react";

export const useResponsiveSegments = (): number => {
  const [segmentsPerRow, setSegmentsPerRow] = useState(12);

  useEffect(() => {
    const updateSegments = () => {
      const width = window.innerWidth;

      if (width >= 1200) {
        setSegmentsPerRow(12); // Десктоп
      } else if (width >= 768) {
        setSegmentsPerRow(8); // Планшет
      } else if (width >= 480) {
        setSegmentsPerRow(6); // Мобільний
      } else {
        setSegmentsPerRow(4); // Дуже маленький
      }
    };

    updateSegments();
    window.addEventListener("resize", updateSegments);
    return () => window.removeEventListener("resize", updateSegments);
  }, []);

  return segmentsPerRow;
};