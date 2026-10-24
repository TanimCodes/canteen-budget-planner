import { Bricolage_Grotesque, Caveat, DM_Sans } from 'next/font/google';

// Fonts live in one place. If your Next.js version says "Unknown font Bricolage_Grotesque",
// run `npm i next@latest` or swap it for another Google font here (e.g. Outfit).
export const display = Bricolage_Grotesque({ subsets: ['latin'], weight: ['600', '800'] });
export const hand = Caveat({ subsets: ['latin'], weight: ['600'] });
export const body = DM_Sans({ subsets: ['latin'] });

export const focus =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#23201B]';

export const RECEIPT_EDGE =
  '[clip-path:polygon(0_0,100%_0,100%_calc(100%-10px),95%_100%,90%_calc(100%-10px),85%_100%,80%_calc(100%-10px),75%_100%,70%_calc(100%-10px),65%_100%,60%_calc(100%-10px),55%_100%,50%_calc(100%-10px),45%_100%,40%_calc(100%-10px),35%_100%,30%_calc(100%-10px),25%_100%,20%_calc(100%-10px),15%_100%,10%_calc(100%-10px),5%_100%,0_calc(100%-10px))]';
