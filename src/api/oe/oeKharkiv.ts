// src/api/oe/oeKharkiv.ts
import { adaptOEBase } from './oeBase';
import type { AdaptedOESchedule } from './oeBase';
import type { OEData } from './oeApi';

export const adaptKharkiv = (
  oeData: OEData,
  regionName: string
): AdaptedOESchedule => {
  return adaptOEBase(oeData, regionName);
};