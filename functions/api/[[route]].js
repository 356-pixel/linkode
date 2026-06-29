// Cloudflare Pages Function — handles all /api/* routes
// Bind a KV namespace named LINK_KV in the Pages project settings.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const onRequestOptions = () =>
  new Response(null, { headers: corsHeaders });

export async function onRequest(context) {
  const { request, env, params } = context;
  const segments = Array.isArray(params.route) ? params.route : [params.route].filter(Boolean);
  const sub = segments[0] || "";

  // =========================
  // 1. CREATE LINK (POST /api/create)
  // =========================
  if (sub === "create" && request.method === "POST") {
    try {
      const { slug, target } = await request.json();
      if (!slug || !target) {
        return json({ error: "Missing slug or target" }, 400);
      }
      await env.LINK_KV.put(slug, target);
      return json({
        ok: true,
        slug,
        shortLink: `https://linkode.co/${slug}`,
      });
    } catch {
      return json({ error: "Invalid request" }, 400);
    }
  }

  // =========================
  // 2. SHORT LINK HANDLER (GET /api/:slug)
  // =========================
  if (request.method === "GET" && sub) {
    const target = await env.LINK_KV.get(sub);
    if (!target) {
      return new Response("404 - Not found", { status: 404, headers: corsHeaders });
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
            <h2 style="font-weight: bold;">Open in external browser</h2>
            <p>This website link: <b>https://linkode.co/${sub}</b> doesn't support the Facebook in-app browser.</p>
            <p>Please tap ⋮ (top-right) and choose:</p>
            <p style="font-weight: bold;">Open in External Browser</p>
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
  }

  return new Response("Linkode API is running", { status: 200, headers: corsHeaders });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
