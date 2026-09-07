"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

const ITEMS = [
  { href: "/", label: "Tổng quan", icon: DashboardIcon },
  { href: "/body", label: "Body", icon: BodyIcon },
  { href: "/meals", label: "Bữa ăn", icon: MealIcon },
  { href: "/workout", label: "Tập", icon: WorkoutIcon },
  { href: "/inbody", label: "InBody", icon: ScanIcon },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <nav className="sticky bottom-0 z-20 border-t border-line bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
      <div className="mx-auto flex max-w-3xl items-stretch justify-between px-1">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center gap-1 py-2.5"
            >
              <Icon
                className={clsx(
                  "h-5 w-5 transition-colors",
                  active ? "text-rust" : "text-faint"
                )}
              />
              <span
                className={clsx(
                  "font-display text-[10px] uppercase tracking-wide transition-colors",
                  active ? "text-ink" : "text-faint"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-1 flex-col items-center gap-1 py-2.5"
          aria-label="Đăng xuất"
        >
          <ExitIcon className="h-5 w-5 text-faint" />
          <span className="font-display text-[10px] uppercase tracking-wide text-faint">
            Thoát
          </span>
        </button>
      </div>
    </nav>
  );
}

function DashboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M4 13h5V4H4v9Zm0 7h5v-5H4v5Zm7 0h9V11h-9v9Zm0-16v5h9V4h-9Z" strokeLinejoin="round" />
    </svg>
  );
}
function BodyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <circle cx="12" cy="4.5" r="2" />
      <path d="M8 9.5 12 8l4 1.5v4L14 15v6h-4v-6l-2-1.5v-4Z" strokeLinejoin="round" />
    </svg>
  );
}
function MealIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M6 3v7a2 2 0 0 0 4 0V3M8 10v11M18 3c-2 1-3 3-3 6s1 3 3 3v9" strokeLinecap="round" />
    </svg>
  );
}
function WorkoutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M4 8v8M2 10v4M22 10v4M20 8v8M7 12h10" strokeLinecap="round" />
    </svg>
  );
}
function ScanIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M4 8V5h3M17 5h3v3M20 16v3h-3M7 19H4v-3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 12h16" strokeLinecap="round" />
    </svg>
  );
}
function ExitIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M9 4H5v16h4M13 8l4 4-4 4M17 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
