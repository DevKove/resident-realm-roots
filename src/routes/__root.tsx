import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts, type ErrorComponentProps } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import appCss from "../styles.css?url";
import faviconIcoUrl from "../../IMG/favicon.ico?url";
import faviconPngUrl from "../../IMG/favicon.png?url";
import appIconUrl from "../../IMG/icon.png?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SindCoopThemeInitializer, ThemeSelector } from "../components/sindcoop-theme";

function NotFoundComponent() {
  return <div className="flex min-h-screen items-center justify-center bg-background px-4"><div className="max-w-md text-center"><h1 className="text-7xl font-bold text-foreground">404</h1><h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2><p className="mt-2 text-sm text-muted-foreground">A página solicitada não existe ou foi movida.</p><Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Voltar ao início</Link></div></div>;
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return <div className="flex min-h-screen items-center justify-center bg-background px-4"><div className="max-w-md text-center"><h1 className="text-xl font-semibold text-foreground">Não foi possível carregar a página</h1><p className="mt-2 text-sm text-muted-foreground">Ocorreu um erro inesperado. Tente novamente.</p><button onClick={() => { router.invalidate(); reset(); }} className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Tentar novamente</button></div></div>;
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SindCoop | Gestão condominial" },
      { name: "description", content: "Gestão condominial simplificada para síndicos, administradores e moradores." },
      { name: "author", content: "SindCoop" },
      { property: "og:title", content: "SindCoop | Gestão condominial" },
      { property: "og:description", content: "Gestão condominial simplificada, segura e transparente." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: faviconIcoUrl, type: "image/x-icon" },
      { rel: "icon", href: faviconPngUrl, type: "image/png", sizes: "32x32" },
      { rel: "shortcut icon", href: faviconIcoUrl, type: "image/x-icon" },
      { rel: "apple-touch-icon", href: appIconUrl, sizes: "500x500" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return <html lang="pt-BR"><head><HeadContent /></head><body>{children}<Scripts /></body></html>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return <QueryClientProvider client={queryClient}><SindCoopThemeInitializer /><Outlet /><ThemeSelector /></QueryClientProvider>;
}
