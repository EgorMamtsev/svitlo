// src/api/oe/oeFactory.ts
import { adaptPoltava } from './oePoltava';
import { adaptZhytomyr } from './oeZhytomyr';
import { adaptChernihiv } from './oeChernihiv';
import { adaptCherkasy } from './oeCherkasy';
import { adaptKharkiv } from './oeKharkiv';
import type { AdaptedOESchedule } from './oeBase';
import type { OEData } from './oeApi';

const adapters: Record<
  string,
  (data: OEData, name: string) => AdaptedOESchedule
> = {
  poltava: adaptPoltava,
  zhytomyr: adaptZhytomyr,
  chernihiv: adaptChernihiv,
  cherkasy: adaptCherkasy,
  kharkiv: adaptKharkiv,
};

export const adaptOEByKey = (
  adapterKey: string,
  oeData: OEData,
  regionName: string
): AdaptedOESchedule => {
  const adapter = adapters[adapterKey] || adaptPoltava;
  return adapter(oeData, regionName);
};