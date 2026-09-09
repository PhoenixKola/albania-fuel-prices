export default function JourneyArtwork() {
  return <svg className="journeyArtwork" viewBox="0 0 340 300" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="journey-road" x1="60" y1="280" x2="280" y2="20" gradientUnits="userSpaceOnUse"><stop stopColor="var(--journey-route-start)" /><stop offset="1" stopColor="var(--journey-route-end)" /></linearGradient>
      <pattern id="journey-grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" stroke="currentColor" strokeOpacity=".08" /></pattern>
    </defs>
    <rect width="340" height="300" fill="url(#journey-grid)" />
    <path d="M0 211C61 150 89 249 148 178S251 155 340 81M-20 162C33 98 94 175 135 99S271 101 344 27M-19 257C62 208 106 292 199 223S300 202 353 164" stroke="currentColor" strokeOpacity=".13" strokeWidth="1.5" />
    <path d="M48 258C94 258 124 238 121 207C118 176 68 178 79 136C90 94 239 153 255 105C271 57 216 57 234 31" stroke="var(--journey-road-body)" strokeWidth="30" strokeLinecap="round" />
    <path className="journeyRoadLine" d="M48 258C94 258 124 238 121 207C118 176 68 178 79 136C90 94 239 153 255 105C271 57 216 57 234 31" stroke="url(#journey-road)" strokeWidth="3" strokeDasharray="5 9" strokeLinecap="round" />
    <circle cx="48" cy="258" r="17" fill="var(--journey-marker-halo)" fillOpacity=".12" /><circle cx="48" cy="258" r="7" fill="var(--journey-marker)" />
    <circle cx="234" cy="31" r="17" fill="var(--journey-marker-halo)" fillOpacity=".12" /><circle cx="234" cy="31" r="7" fill="var(--journey-marker)" />
    <g transform="translate(141 141)"><rect x="-24" y="-24" width="48" height="48" rx="14" fill="var(--journey-icon-surface)" /><path d="M-8 9V-10H4V9M-11 9H7M-8-3H4M4-8H8L12-3V6C12 10 8 10 8 6V2H4" stroke="var(--journey-icon-ink)" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" /></g>
    <path d="M298 234v18m-9-9h18M32 54v12m-6-6h12" stroke="currentColor" strokeOpacity=".3" />
  </svg>;
}
