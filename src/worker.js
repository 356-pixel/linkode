export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // =========================
    // CORS HEADERS
    // =========================
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // =========================
    // HANDLE PRE-FLIGHT (CORS)
    // =========================
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    // =========================
    // 1. CREATE LINK (FROM LOVABLE)
    // =========================
    if (path === "/create" && request.method === "POST") {
      try {
        const { slug, target } = await request.json();

        if (!slug || !target) {
          return new Response(
            JSON.stringify({ error: "Missing slug or target" }),
            {
              status: 400,
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
              },
            }
          );
        }

        // store in KV (LINK_KV binding)
        await env.LINK_KV.put(slug, target);

        return new Response(
          JSON.stringify({
            ok: true,
            slug,
            shortLink: `https://linkode.co/${slug}`,
          }),
          {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({ error: "Invalid request" }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    // =========================
    // 2. SHORT LINK HANDLER
    // =========================
    const slug = path.slice(1);

    if (!slug) {
      return new Response("Linkode Worker is running", {
        status: 200,
        headers: corsHeaders,
      });
    }

    const target = await env.LINK_KV.get(slug);

    if (!target) {
      return new Response("404 - Not found", {
        status: 404,
        headers: corsHeaders,
      });
    }

    // =========================
    // 3. FACEBOOK IN-APP BROWSER PAGE
    // =========================
    const ua = request.headers.get("User-Agent") || "";
    const isFacebook = ua.includes("FBAN") || ua.includes("FBAV");

    if (isFacebook) {
      return new Response(
        `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Open in External Browser</title>
          </head>
          <body style="font-family: Arial; padding: 24px; line-height: 1.6;">
            <h2 style="font-weight: bold;">
              Open in external browser
            </h2>
            <p>
              This website link: <b>https://linkode.co/${slug}</b> doesn't support the Facebook in-app browser.
            </p>
            <p>Please tap ⋮ (top-right) and choose:</p>
            <p style="font-weight: bold;">
              Open in External Browser
            </p>
          </body>
        </html>
        `,
        {
          headers: {
            "Content-Type": "text/html; charset=UTF-8",
            "Cache-Control": "no-store",
            ...corsHeaders,
          },
        }
      );
    }

    // =========================
    // 4. NORMAL REDIRECT
    // =========================
    return Response.redirect(target, 302);
  },
};
