import { Check, Palette } from "lucide-react";
import { useEffect, useState } from "react";

export const SINDCOOP_THEMES = [
  { id: "ocean", name: "Azul Executivo", description: "Institucional e equilibrado", swatch: "#0f5b6b" },
  { id: "forest", name: "Verde Esmeralda", description: "Natural e acolhedor", swatch: "#176b4d" },
  { id: "royal", name: "Roxo Premium", description: "Elegante e contemporâneo", swatch: "#4c3b8f" },
  { id: "graphite", name: "Grafite", description: "Minimalista e sóbrio", swatch: "#30343b" },
  { id: "wine", name: "Vinho", description: "Sofisticado e marcante", swatch: "#7a2848" },
] as const;

export type SindCoopTheme = (typeof SINDCOOP_THEMES)[number]["id"];

const STORAGE_KEY = "sindcoop-theme";
const DEFAULT_THEME: SindCoopTheme = "ocean";

export function applySindCoopTheme(theme: SindCoopTheme) {
  document.documentElement.dataset.sindcoopTheme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
}

export function getStoredSindCoopTheme(): SindCoopTheme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const value = localStorage.getItem(STORAGE_KEY);
  return SINDCOOP_THEMES.some((theme) => theme.id === value) ? (value as SindCoopTheme) : DEFAULT_THEME;
}

export function SindCoopThemeInitializer() {
  useEffect(() => {
    document.documentElement.dataset.sindcoopTheme = getStoredSindCoopTheme();
  }, []);
  return null;
}

export function ThemeSelector({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<SindCoopTheme>(DEFAULT_THEME);
  const [open, setOpen] = useState(false);

  useEffect(() => setTheme(getStoredSindCoopTheme()), []);

  function choose(next: SindCoopTheme) {
    setTheme(next);
    applySindCoopTheme(next);
    setOpen(false);
  }

  const current = SINDCOOP_THEMES.find((item) => item.id === theme) ?? SINDCOOP_THEMES[0];

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Escolher tema do layout"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: current.swatch }} />
        {!compact && <><Palette className="h-4 w-4" /> Tema</>}
      </button>

      {open && (
        <>
          <button aria-label="Fechar seletor de tema" className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border bg-white p-2 shadow-2xl">
            <div className="px-3 py-2">
              <p className="text-sm font-bold text-slate-900">Tema do layout</p>
              <p className="mt-0.5 text-xs text-slate-500">Escolha a aparência do SindCoop.</p>
            </div>
            <div className="mt-1 grid gap-1">
              {SINDCOOP_THEMES.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => choose(item.id)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-50"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: item.swatch }}>
                    {theme === item.id && <Check className="h-4 w-4 text-white" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-900">{item.name}</span>
                    <span className="block text-xs text-slate-500">{item.description}</span>
                  </span>
                  {theme === item.id && <span className="text-xs font-bold text-slate-500">Ativo</span>}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
