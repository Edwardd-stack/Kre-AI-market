import { useId } from "react";
import type { ReactElement } from "react";
import { Box } from "@mui/material";
import { Lang } from "../../../libs/enums/ai.enum";

/**
 * Yumaloq bayroqlar — inline SVG (emoji bayroqlar Windows'da "KR" harflari bo'lib ko'rinadi).
 * Hammasi 24×24 viewBox, doira shaklida kesiladi.
 */
const FLAGS: Record<Lang, ReactElement> = {
  [Lang.KO]: (
    <>
      <rect width="24" height="24" fill="#fff" /><g transform="rotate(33.7 12 12)"><path d="M7 12 A5 5 0 0 1 17 12 A2.5 2.5 0 0 1 12 12 A2.5 2.5 0 0 0 7 12 Z" fill="#CD2E3A" /><path d="M7 12 A5 5 0 0 0 17 12 A2.5 2.5 0 0 1 12 12 A2.5 2.5 0 0 0 7 12 Z" fill="#0047A0" /></g><g transform="translate(5.6 7.2) rotate(-56.3)" fill="#111"><rect x="-2.4" y="-2.1" width="4.8" height="1"  /><rect x="-2.4" y="-0.5" width="4.8" height="1"  /><rect x="-2.4" y="1.1" width="4.8" height="1"  /></g><g transform="translate(18.4 16.8) rotate(-56.3)" fill="#111"><rect x="-2.4" y="-2.1" width="2.1" height="1"  /><rect x="0.3" y="-2.1" width="2.1" height="1"  /><rect x="-2.4" y="-0.5" width="2.1" height="1"  /><rect x="0.3" y="-0.5" width="2.1" height="1"  /><rect x="-2.4" y="1.1" width="2.1" height="1"  /><rect x="0.3" y="1.1" width="2.1" height="1"  /></g><g transform="translate(18.4 7.2) rotate(56.3)" fill="#111"><rect x="-2.4" y="-2.1" width="2.1" height="1"  /><rect x="0.3" y="-2.1" width="2.1" height="1"  /><rect x="-2.4" y="-0.5" width="4.8" height="1"  /><rect x="-2.4" y="1.1" width="2.1" height="1"  /><rect x="0.3" y="1.1" width="2.1" height="1"  /></g><g transform="translate(5.6 16.8) rotate(56.3)" fill="#111"><rect x="-2.4" y="-2.1" width="4.8" height="1"  /><rect x="-2.4" y="-0.5" width="2.1" height="1"  /><rect x="0.3" y="-0.5" width="2.1" height="1"  /><rect x="-2.4" y="1.1" width="4.8" height="1"  /></g>
    </>
  ),
  [Lang.EN]: (
    <>
      <rect width="24" height="24" fill="#fff" /><rect y="0.00" width="24" height="1.85" fill="#B22234" /><rect y="3.69" width="24" height="1.85" fill="#B22234" /><rect y="7.38" width="24" height="1.85" fill="#B22234" /><rect y="11.08" width="24" height="1.85" fill="#B22234" /><rect y="14.77" width="24" height="1.85" fill="#B22234" /><rect y="18.46" width="24" height="1.85" fill="#B22234" /><rect y="22.15" width="24" height="1.85" fill="#B22234" /><rect width="12" height="12.92" fill="#3C3B6E" /><circle cx="2.0" cy="1.9" r="0.55" fill="#fff" /><circle cx="4.6" cy="1.9" r="0.55" fill="#fff" /><circle cx="7.2" cy="1.9" r="0.55" fill="#fff" /><circle cx="9.8" cy="1.9" r="0.55" fill="#fff" /><circle cx="3.3" cy="4.8" r="0.55" fill="#fff" /><circle cx="5.9" cy="4.8" r="0.55" fill="#fff" /><circle cx="8.5" cy="4.8" r="0.55" fill="#fff" /><circle cx="11.1" cy="4.8" r="0.55" fill="#fff" /><circle cx="2.0" cy="7.7" r="0.55" fill="#fff" /><circle cx="4.6" cy="7.7" r="0.55" fill="#fff" /><circle cx="7.2" cy="7.7" r="0.55" fill="#fff" /><circle cx="9.8" cy="7.7" r="0.55" fill="#fff" /><circle cx="3.3" cy="10.6" r="0.55" fill="#fff" /><circle cx="5.9" cy="10.6" r="0.55" fill="#fff" /><circle cx="8.5" cy="10.6" r="0.55" fill="#fff" /><circle cx="11.1" cy="10.6" r="0.55" fill="#fff" />
    </>
  ),
  [Lang.RU]: (
    <>
      <rect width="24" height="8" fill="#fff" /><rect y="8" width="24" height="8" fill="#0039A6" /><rect y="16" width="24" height="8" fill="#D52B1E" />
    </>
  ),
  [Lang.UZ]: (
    <>
      <rect width="24" height="7.6" fill="#0099B5" /><rect y="7.6" width="24" height="0.6" fill="#CE1126" /><rect y="8.2" width="24" height="7.6" fill="#fff" /><rect y="15.8" width="24" height="0.6" fill="#CE1126" /><rect y="16.4" width="24" height="7.6" fill="#1EB53A" /><circle cx="6.6" cy="4.1" r="2.6" fill="#fff" /><circle cx="7.6" cy="4.1" r="2.2" fill="#0099B5" /><circle cx="11" cy="2.4" r="0.5" fill="#fff" /><circle cx="13" cy="2.4" r="0.5" fill="#fff" /><circle cx="15" cy="2.4" r="0.5" fill="#fff" /><circle cx="11" cy="4.2" r="0.5" fill="#fff" /><circle cx="13" cy="4.2" r="0.5" fill="#fff" /><circle cx="15" cy="4.2" r="0.5" fill="#fff" /><circle cx="13" cy="6.0" r="0.5" fill="#fff" /><circle cx="15" cy="6.0" r="0.5" fill="#fff" /><circle cx="11" cy="6.0" r="0.5" fill="#fff" />
    </>
  ),
};

interface FlagIconProps {
  lang: Lang;
  size?: number;
}

export default function FlagIcon({ lang, size = 22 }: FlagIconProps) {
  const clipId = useId(); // bir sahifada bir nechta bayroq — id'lar to'qnashmasin

  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      sx={{ width: size, height: size, flexShrink: 0, display: "block", borderRadius: "50%", boxShadow: "0 1px 3px rgba(0,0,0,0.25)" }}
      aria-hidden
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>{FLAGS[lang] ?? FLAGS[Lang.KO]}</g>
      <circle cx="12" cy="12" r="11.6" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" />
    </Box>
  );
}
