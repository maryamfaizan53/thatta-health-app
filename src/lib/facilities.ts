import type { Taluka } from "./i18n";

export type Facility = {
  name: string;
  type: "DHQ" | "RHC" | "BHU";
  taluka: Taluka;
  managed_by: string;
  has_emergency: boolean | null;
  has_asv: boolean | null; // anti-snake venom
  has_arv: boolean | null; // anti-rabies vaccine
  phone: string | null;
  lat: number | null;
  lng: number | null;
  maps_query: string;
};

/**
 * Sample facility directory for Thatta district.
 * Phone numbers and service availability (ASV/ARV) are left null
 * until verified — the UI shows "not verified — call first".
 */
export const facilities: Facility[] = [
  {
    name: "DHQ Civil Hospital Thatta",
    type: "DHQ",
    taluka: "Thatta",
    managed_by: "Government of Sindh",
    has_emergency: true,
    has_asv: null,
    has_arv: null,
    phone: null,
    lat: 24.7461,
    lng: 67.9243,
    maps_query: "DHQ Civil Hospital Thatta",
  },
  {
    name: "RHC Mirpur Sakro",
    type: "RHC",
    taluka: "Mirpur Sakro",
    managed_by: "Government of Sindh",
    has_emergency: null,
    has_asv: null,
    has_arv: null,
    phone: null,
    lat: 24.5514,
    lng: 67.6308,
    maps_query: "Rural Health Center Mirpur Sakro",
  },
  {
    name: "RHC Ghorabari",
    type: "RHC",
    taluka: "Ghorabari",
    managed_by: "Government of Sindh",
    has_emergency: null,
    has_asv: null,
    has_arv: null,
    phone: null,
    lat: 24.3283,
    lng: 67.7031,
    maps_query: "Rural Health Center Ghorabari",
  },
  {
    name: "RHC Keti Bandar",
    type: "RHC",
    taluka: "Keti Bandar",
    managed_by: "Government of Sindh",
    has_emergency: null,
    has_asv: null,
    has_arv: null,
    phone: null,
    lat: 24.1442,
    lng: 67.4506,
    maps_query: "Rural Health Center Keti Bandar",
  },
  {
    name: "BHU Makli",
    type: "BHU",
    taluka: "Thatta",
    managed_by: "Government of Sindh",
    has_emergency: null,
    has_asv: null,
    has_arv: null,
    phone: null,
    lat: 24.7658,
    lng: 67.8972,
    maps_query: "Basic Health Unit Makli Thatta",
  },
  {
    name: "BHU Sujawal Road Thatta",
    type: "BHU",
    taluka: "Thatta",
    managed_by: "Government of Sindh",
    has_emergency: null,
    has_asv: null,
    has_arv: null,
    phone: null,
    lat: 24.72,
    lng: 67.93,
    maps_query: "Basic Health Unit Sujawal Road Thatta",
  },
  {
    name: "BHU Daro Mirpur Sakro",
    type: "BHU",
    taluka: "Mirpur Sakro",
    managed_by: "Government of Sindh",
    has_emergency: null,
    has_asv: null,
    has_arv: null,
    phone: null,
    lat: 24.58,
    lng: 67.66,
    maps_query: "Basic Health Unit Daro Mirpur Sakro",
  },
  {
    name: "BHU Chuhar Jamali Ghorabari",
    type: "BHU",
    taluka: "Ghorabari",
    managed_by: "Government of Sindh",
    has_emergency: null,
    has_asv: null,
    has_arv: null,
    phone: null,
    lat: 24.38,
    lng: 67.76,
    maps_query: "Basic Health Unit Chuhar Jamali",
  },
  {
    name: "BHU Shah Bandar Keti Bandar",
    type: "BHU",
    taluka: "Keti Bandar",
    managed_by: "Government of Sindh",
    has_emergency: null,
    has_asv: null,
    has_arv: null,
    phone: null,
    lat: 24.17,
    lng: 67.98,
    maps_query: "Basic Health Unit Shah Bandar",
  },
];

export function facilitiesFor(taluka: Taluka): Facility[] {
  const rank = { DHQ: 0, RHC: 1, BHU: 2 };
  const local = facilities.filter((f) => f.taluka === taluka);
  const rest = facilities.filter((f) => f.taluka !== taluka);
  return [...local, ...rest].sort((a, b) => {
    if (a.type === "DHQ" || b.type === "DHQ") return rank[a.type] - rank[b.type];
    const aLocal = a.taluka === taluka ? 0 : 1;
    const bLocal = b.taluka === taluka ? 0 : 1;
    return aLocal - bLocal || rank[a.type] - rank[b.type];
  });
}

export function directionsUrl(f: Facility): string {
  if (f.lat != null && f.lng != null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(f.maps_query)}`;
}
