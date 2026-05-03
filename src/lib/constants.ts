export const SITE_NAME =
  process.env.NEXT_PUBLIC_SITE_NAME ?? "[Business Name] Equipment";

export const CONTACT_PHONE =
  process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "(555) 123-4567";

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "info@example.com";

export const SPEC_PRESETS: Record<string, { key: string; label: string }[]> = {
  "wire-strippers": [
    { key: "yearBuilt", label: "Year Built" },
    { key: "wireDiameterRange", label: "Wire Diameter Range" },
    { key: "stripLength", label: "Strip Length" },
    { key: "voltage", label: "Voltage" },
    { key: "weight", label: "Weight" },
    { key: "programMemory", label: "Program Memory" },
  ],
  "crimping-machines": [
    { key: "yearBuilt", label: "Year Built" },
    { key: "crimpForce", label: "Crimp Force" },
    { key: "wireDiameterRange", label: "Wire Diameter Range" },
    { key: "voltage", label: "Voltage" },
    { key: "weight", label: "Weight" },
  ],
  "cutting-machines": [
    { key: "yearBuilt", label: "Year Built" },
    { key: "wireDiameterRange", label: "Wire Diameter Range" },
    { key: "cuttingSpeed", label: "Cutting Speed" },
    { key: "voltage", label: "Voltage" },
    { key: "weight", label: "Weight" },
  ],
  default: [
    { key: "yearBuilt", label: "Year Built" },
    { key: "voltage", label: "Voltage" },
    { key: "weight", label: "Weight" },
  ],
};
