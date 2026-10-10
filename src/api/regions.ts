// src/api/regions.ts

export interface RegionOption {
  id: string;
  name: string;
  source: "yasno" | "oe";
  regionId?: number;
  dsoId?: number;
  fileName?: string;
}

export const REGIONS: RegionOption[] = [
  // Yasno (Київ, Дніпро)
  {
    id: "yasno-25",
    name: "Київ",
    source: "yasno",
    regionId: 25,
    dsoId: 902,
  },
  {
    id: "yasno-3",
    name: "Дніпро",
    source: "yasno",
    regionId: 3,
    dsoId: 301,
  },
  // OE_OUTAGE_DATA (Полтава)
  {
    id: "oe-Poltavaoblenergo",
    name: "Полтавська обл.",
    source: "oe",
    fileName: "Poltavaoblenergo",
  },
];