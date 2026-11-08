import {
  Activity,
  Ambulance,
  Apple,
  AudioLines,
  Baby,
  Bandage,
  BedSingle,
  Bone,
  Brain,
  Cable,
  ClipboardCheck,
  ClipboardPlus,
  Droplets,
  Dumbbell,
  FlaskConical,
  Flower2,
  Footprints,
  HandHeart,
  HeartHandshake,
  HeartPulse,
  House,
  MonitorDot,
  Moon,
  Pill,
  ShieldPlus,
  Stethoscope,
  Sun,
  Syringe,
  Video,
  Watch,
  Waves,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { ComponentProps } from "react";
import type { ServiceIconName } from "@/config/services";

export function WhatsAppIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.75-.71 2-1.4.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.89 9.88Zm8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9a11.82 11.82 0 0 0-3.48-8.4Z" />
    </svg>
  );
}

/** لا توجد أيقونة رئتين في lucide، فهذه أيقونة بسيطة بنفس أسلوبها */
function LungsIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 3v8" />
      <path d="M12 11c-1 1.5-2.5 2-4 2" />
      <path d="M12 11c1 1.5 2.5 2 4 2" />
      <path d="M8.5 7C6 8 3 12.5 3 17c0 2.5 1.5 3.5 3 3 2-.7 3.5-1.5 3.5-4V8a1 1 0 0 0-1-1Z" />
      <path d="M15.5 7c2.5 1 5.5 5.5 5.5 10 0 2.5-1.5 3.5-3 3-2-.7-3.5-1.5-3.5-4V8a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

const SERVICE_ICONS: Record<ServiceIconName, LucideIcon | typeof LungsIcon> = {
  assessment: ClipboardCheck,
  wound: Bandage,
  foot: Footprints,
  respiratory: Wind,
  tube: Cable,
  brain: Brain,
  palliative: HandHeart,
  nutrition: Apple,
  kidney: Droplets,
  sleep: Moon,
  mother: Flower2,
  baby: Baby,
  sun: Sun,
  vaccine: ShieldPlus,
  fetal: HeartPulse,
  video: Video,
  watch: Watch,
  pill: Pill,
  doctor: Stethoscope,
  orthopedic: Bone,
  nursing: Syringe,
  lab: FlaskConical,
  physio: Dumbbell,
  icu: MonitorDot,
  equipment: BedSingle,
  companion: HeartHandshake,
  ambulance: Ambulance,
  home: House,
  chest: LungsIcon,
  bone: Bone,
  followUp: ClipboardPlus,
  echo: HeartPulse,
  ecg: Activity,
  ultrasound: AudioLines,
  doppler: Waves,
};

export function ServiceIcon({ name, className }: { name: ServiceIconName; className?: string }) {
  const Icon = SERVICE_ICONS[name];
  return <Icon aria-hidden="true" className={className} />;
}

/** خط نبض ذهبي، زخرفة مأخوذة من تذييل الإعلان */
export function PulseLine({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 40"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M0 22h150l10-12 12 26 16-34 14 30 10-10h188"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
