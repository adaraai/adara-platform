import type { ReactNode } from "react";

export const FLAG_REGIONS = [
  { code: "GH", name: "Ghana" },
  { code: "NG", name: "Nigeria" },
  { code: "KE", name: "Kenya" },
  { code: "ZA", name: "South Africa" },
  { code: "ET", name: "Ethiopia" },
  { code: "SN", name: "Senegal" },
  { code: "RW", name: "Rwanda" },
  { code: "TZ", name: "Tanzania" },
  { code: "UG", name: "Uganda" },
  { code: "CI", name: "Côte d'Ivoire" },
] as const;

export type FlagCode = (typeof FLAG_REGIONS)[number]["code"];

const FLAG_MARKUP: Record<FlagCode, ReactNode> = {
  GH: (
    <>
      <path fill="#ce1126" d="M0 0h36v8H0z" />
      <path fill="#fcd116" d="M0 8h36v8H0z" />
      <path fill="#006b3f" d="M0 16h36v8H0z" />
      <path fill="#000" d="m18 8 2.93 9-7.66-5.56h9.46L15.07 17z" />
    </>
  ),
  NG: (
    <>
      <path fill="#008753" d="M0 0h12v24H0z" />
      <path fill="#fff" d="M12 0h12v24H12z" />
      <path fill="#008753" d="M24 0h12v24H24z" />
    </>
  ),
  KE: (
    <>
      <path fill="#000" d="M0 0h36v7.2H0z" />
      <path fill="#fff" d="M0 7.2h36v9.6H0z" />
      <path fill="#bb0000" d="M0 8.4h36v7.2H0z" />
      <path fill="#006600" d="M0 16.8h36V24H0z" />
      <path fill="#8b6914" d="M12.4 3.2h.85v17.6h-.85zm10.35 0h.85v17.6h-.85z" />
      <ellipse cx="18" cy="12" rx="3.6" ry="6.2" fill="#bb0000" stroke="#fff" strokeWidth="0.7" />
      <ellipse cx="18" cy="12" rx="1.15" ry="2.1" fill="#fff" />
    </>
  ),
  ZA: (
    <>
      <path fill="#e03c31" d="M0 0h36v12H0z" />
      <path fill="#001489" d="M0 12h36v12H0z" />
      <path fill="#fff" d="M0 8h36v8H0zM0 0l18 12L0 24z" />
      <path fill="#007749" d="M18 8.6h18v6.8H18zM0 4.6 10.8 12 0 19.4z" />
      <path fill="#ffb81c" d="M0 3.4 10.2 12 0 20.6z" />
      <path fill="#000" d="M0 4.2 9 12 0 19.8z" />
    </>
  ),
  ET: (
    <>
      <path fill="#078930" d="M0 0h36v8H0z" />
      <path fill="#fcdd09" d="M0 8h36v8H0z" />
      <path fill="#da121a" d="M0 16h36v8H0z" />
      <circle cx="18" cy="12" r="5.4" fill="#0f47af" />
      <path fill="#fcdd09" d="m18 7.3 1.15 3.52h3.7l-3 2.17 1.15 3.53L18 14.35l-3 2.17 1.15-3.53-3-2.17h3.7z" />
    </>
  ),
  SN: (
    <>
      <path fill="#0b7226" d="M0 0h12v24H0z" />
      <path fill="#ff0" d="M12 0h12v24H12z" />
      <path fill="#bc0000" d="M24 0h12v24H24z" />
      <path fill="#0b7226" d="m18 7.4 1.22 3.74h3.94l-3.19 2.31 1.22 3.74L18 14.88l-3.19 2.31 1.22-3.74-3.19-2.31h3.94z" />
    </>
  ),
  RW: (
    <>
      <path fill="#00a1de" d="M0 0h36v12H0z" />
      <path fill="#fad201" d="M0 12h36v6H0z" />
      <path fill="#20603d" d="M0 18h36v6H0z" />
      <circle cx="28.5" cy="6.2" r="2.85" fill="#e5be01" />
    </>
  ),
  TZ: (
    <>
      <path fill="#09f" d="M0 0h36v24H0z" />
      <path fill="#090" d="M0 0h36L0 24z" />
      <path fill="#000" d="M0 24h8l28-19V0h-8L0 19z" />
      <path fill="#ff0" d="M0 18.3 27.4 0h2.7L0 20.1zm5.9 5.7L36 3.9v1.8L8.6 24z" />
    </>
  ),
  UG: (
    <>
      <path fill="#000" d="M0 0h36v4H0z" />
      <path fill="#ffe700" d="M0 4h36v4H0z" />
      <path fill="#de3908" d="M0 8h36v4H0z" />
      <path fill="#000" d="M0 12h36v4H0z" />
      <path fill="#ffe700" d="M0 16h36v4H0z" />
      <path fill="#de3908" d="M0 20h36v4H0z" />
      <circle cx="18" cy="12" r="5.2" fill="#fff" />
      <path
        fill="#9ca69c"
        d="M16.4 9.2c.4-1.4 1.8-2.2 3.2-1.6.6.3 1 .9 1.1 1.6.3 1.4-.4 2.4-1.2 3.4v3.2c0 .6-.5 1.1-1.1 1.1s-1.1-.5-1.1-1.1v-3.4c-.7-.8-1.3-1.8-.9-3.2z"
      />
      <circle cx="18.6" cy="9.4" r="0.55" fill="#000" />
    </>
  ),
  CI: (
    <>
      <path fill="#ff9a00" d="M0 0h12v24H0z" />
      <path fill="#fff" d="M12 0h12v24H12z" />
      <path fill="#00cd00" d="M24 0h12v24H24z" />
    </>
  ),
};

export function CountryFlag({ code, name }: { code: FlagCode; name: string }) {
  return (
    <svg
      viewBox="0 0 36 24"
      className="country-flag h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${name} flag`}
    >
      {FLAG_MARKUP[code]}
    </svg>
  );
}
