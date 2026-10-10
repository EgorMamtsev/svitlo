// src/api/oe/oeChernihiv.ts
import { adaptOEBase } from './oeBase';
import type { AdaptedOESchedule } from './oeBase';
import type { OEData } from './oeApi';

export const adaptChernihiv = (
  oeData: OEData,
  regionName: string
): AdaptedOESchedule => {
  return adaptOEBase(oeData, regionName);
};