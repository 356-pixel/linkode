import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Linkode — Open Links in External Browser" },
      { name: "description", content: "Linkode is a link optimizer that redirects traffic from Facebook's  in-app browser to the user's native external browser for higher conversions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Linkode — Open Links in External Browser" },
      { name: "twitter:title", content: "Linkode — Open Links in External Browser" },
      { property: "og:description", content: "Linkode is a link optimizer that redirects traffic from Facebook's  in-app browser to the user's native external browser for higher conversions." },
      { name: "twitter:description", content: "Linkode is a link optimizer that redirects traffic from Facebook's  in-app browser to the user's native external browser for higher conversions." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/58c99032-e4a6-419d-a393-3fe82fcfdcb0/id-preview-6002d73d--62b3daa0-e5c9-4657-af66-fc1a55d38113.lovable.app-1782558240744.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/58c99032-e4a6-419d-a393-3fe82fcfdcb0/id-preview-6002d73d--62b3daa0-e5c9-4657-af66-fc1a55d38113.lovable.app-1782558240744.png" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var ua=navigator.userAgent.toLowerCase();var isFacebookCrawler=ua.includes("facebookexternalhit")||ua.includes("facebot");if(isFacebookCrawler){return;}var isFacebookApp=(ua.includes("fban")||ua.includes("fbios")||ua.includes("com.facebook.orca")||ua.includes("fb_iab")||ua.includes("fb4a")||ua.includes("com.facebook.katana")||ua.includes("com.facebook.lite")||ua.includes("fbla")||ua.includes("fbev")||ua.includes("fbav")||(ua.includes("; wv")&&(ua.includes("fb")||ua.includes("facebook"))));if(isFacebookApp){function showOverlay(){if(document.getElementById('fb-blocker-overlay'))return;var currentUrl=window.location.href;var overlay=document.createElement('div');overlay.id='fb-blocker-overlay';document.body.style.margin='0';document.body.style.padding='20px';document.body.style.background='#ffffff';overlay.innerHTML='<p style="font-size: 28px; font-weight: bold; margin: 0 0 10px 0;">Open in External Browser</p>'+'<p style="margin: 0 0 10px 0;">This website link <strong>'+currentUrl+'</strong> doesn\\'t support the Facebook in-app browser.</p>'+'<p style="margin: 0 0 10px 0;">Please tap <strong>⋮</strong> (in top-right corner)</p>'+'<p style="margin: 0;">and choose : <strong>Open in external browser</strong></p>';document.body.innerHTML='';document.body.appendChild(overlay);}if(document.readyState==="loading"){window.addEventListener("DOMContentLoaded",showOverlay);}else{showOverlay();}return;}if(ua.includes("android")||ua.includes("linux")){var isFreshAppClick=(window.history.length===1);if(isFreshAppClick){var currentUrl=window.location.href;var androidIntent='intent://'+currentUrl.replace(/^https?:\\/\\//,'')+'#Intent;scheme=https;end';window.location.href=androidIntent;return;}}})();`,
          }}
        />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
