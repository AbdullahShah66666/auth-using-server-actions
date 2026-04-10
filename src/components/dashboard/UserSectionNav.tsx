import type { UserSectionKey } from "@/components/dashboard/types";
import type { Dispatch, SetStateAction } from "react";

type UserSection = {
  key: UserSectionKey;
  label: string;
};

type UserSectionNavProps = {
  sections: UserSection[];
  activeSection: UserSectionKey;
  currentSectionLabel: string;
  sectionMenuOpen: boolean;
  setSectionMenuOpen: Dispatch<SetStateAction<boolean>>;
  setActiveSection: Dispatch<SetStateAction<UserSectionKey>>;
};

export default function UserSectionNav({
  sections,
  activeSection,
  currentSectionLabel,
  sectionMenuOpen,
  setSectionMenuOpen,
  setActiveSection,
}: UserSectionNavProps) {
  return (
    <>
      <div className="relative lg:hidden">
        <button
          type="button"
          onClick={() => setSectionMenuOpen((prev) => !prev)}
          className="cursor-pointer flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#0a1020]/70 px-3 py-2.5 text-left text-sm font-medium text-slate-100"
        >
          <span>{currentSectionLabel}</span>
          <svg
            viewBox="0 0 20 20"
            aria-hidden="true"
            className={`h-4 w-4 transition-transform ${
              sectionMenuOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {sectionMenuOpen ? (
          <div className="absolute left-0 right-0 top-12 z-20 rounded-xl border border-white/10 bg-[#0a1020]/95 p-2 shadow-[0_20px_50px_rgba(5,6,13,0.65)] backdrop-blur">
            {sections.map((section) => (
              <button
                key={section.key}
                type="button"
                onClick={() => {
                  setActiveSection(section.key);
                  setSectionMenuOpen(false);
                }}
                className={`cursor-pointer mt-1 w-full rounded-lg border px-3 py-2 text-left text-sm font-medium transition first:mt-0 ${
                  activeSection === section.key
                    ? "border-cyan-300/50 bg-cyan-300/20 text-cyan-100"
                    : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <aside className="hidden rounded-xl border border-white/10 bg-[#0a1020]/70 p-3 lg:block">
        <p className="px-2 text-xs uppercase tracking-[0.22em] text-slate-400">
          Navigation
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {sections.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => setActiveSection(section.key)}
              className={`cursor-pointer w-full rounded-lg border px-3 py-2 text-left text-sm font-medium transition ${
                activeSection === section.key
                  ? "border-cyan-300/50 bg-cyan-300/20 text-cyan-100"
                  : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}
