// src/api/oe/oeZhytomyr.ts
import { adaptOEBase } from './oeBase';
import type { AdaptedOESchedule } from './oeBase';
import type { OEData } from './oeApi';

export const adaptZhytomyr = (
  oeData: OEData,
  regionName: string
): AdaptedOESchedule => {
  return adaptOEBase(oeData, regionName);
};