export type IconName =
  | "activity"
  | "alert"
  | "arrow"
  | "attendance"
  | "calendar"
  | "clock"
  | "document"
  | "grid"
  | "logout"
  | "users";

export function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  const props = {
    className,
    "aria-hidden": true,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
  };

  switch (name) {
    case "activity":
      return (
        <svg {...props}>
          <path d="M3 12h4l2.2-6 4.1 12 2.3-6H21" />
        </svg>
      );
    case "alert":
      return (
        <svg {...props}>
          <path d="m10.3 4.1-7 12.2A1.8 1.8 0 0 0 4.9 19h14.2a1.8 1.8 0 0 0 1.6-2.7l-7-12.2a1.8 1.8 0 0 0-3.4 0Z" />
          <path d="M12 9v4" />
          <path d="M12 16.5h.01" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...props}>
          <path d="M5 12h13" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );
    case "attendance":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="m8.4 12.2 2.3 2.3 4.9-5" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...props}>
          <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
          <path d="M7.5 3.5v3M16.5 3.5v3M3.5 9h17" />
        </svg>
      );
    case "clock":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5v5l3.2 1.8" />
        </svg>
      );
    case "document":
      return (
        <svg {...props}>
          <path d="M7 3.5h7l3 3V20.5H7z" />
          <path d="M14 3.5v3h3M9.5 11h5M9.5 14.5h5M9.5 18h3" />
        </svg>
      );
    case "grid":
      return (
        <svg {...props}>
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="14" width="6" height="6" rx="1" />
        </svg>
      );
    case "logout":
      return (
        <svg {...props}>
          <path d="M14 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H14" />
          <path d="M11 12h8M16 8l4 4-4 4" />
        </svg>
      );
    case "users":
      return (
        <svg {...props}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
          <path d="M15 5.7a3 3 0 0 1 0 5.7M17 14.5a4.8 4.8 0 0 1 3.5 4.5" />
        </svg>
      );
  }
}
