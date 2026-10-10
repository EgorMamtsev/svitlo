// src/api/regions.ts

export interface RegionOption {
  id: string;
  name: string;
  source: "yasno" | "oe";
  regionId?: number;
  dsoId?: number;
  fileName?: string;
  adapterKey?: string;
}

export const REGIONS: RegionOption[] = [
  // ============================================
  // Yasno (Київ, Дніпро)
  // ============================================
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

  // ============================================
  // OE_OUTAGE_DATA (області, де є відключення)
  // ============================================
  {
    id: "oe-Poltavaoblenergo",
    name: "Полтавська обл.",
    source: "oe",
    fileName: "Poltavaoblenergo",
    adapterKey: "poltava",
  },
  {
    id: "oe-Zhytomyroblenergo",
    name: "Житомирська обл.",
    source: "oe",
    fileName: "Zhytomyroblenergo",
    adapterKey: "zhytomyr",
  },
  {
    id: "oe-Chernihivoblenergo",
    name: "Чернігівська обл.",
    source: "oe",
    fileName: "Chernihivoblenergo",
    adapterKey: "chernihiv",
  },
  {
    id: "oe-Cherkasyoblenergo",
    name: "Черкаська обл.",
    source: "oe",
    fileName: "Cherkasyoblenergo",
    adapterKey: "cherkasy",
  },
  {
    id: "oe-Kharkivoblenerho",
    name: "Харківська обл.",
    source: "oe",
    fileName: "Kharkivoblenerho",
    adapterKey: "kharkiv",
  },
];