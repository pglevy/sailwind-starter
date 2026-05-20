---
name: share-link
description: >
  Share your local dev server with others via a public URL using Cloudflare's free quick tunnel service.
  Creates a temporary public link to your localhost so teammates or stakeholders can preview your prototype
  without deploying. Use this skill when the user says "share my prototype", "get a public link",
  "share my local dev", "create a share link", or "let someone else see what I'm working on".
---

# Share Link

Create a temporary public URL that tunnels to your local dev server using Cloudflare's free `cloudflared` quick tunnel.

## When to Use

- Sharing a prototype with a teammate or stakeholder for quick feedback
- Demoing work-in-progress without deploying
- Testing on a mobile device from a different network
- Any time someone needs to see what's running on your localhost

## Prerequisites

- Local dev server already running (typically `pnpm run dev` on port 5173)
- Internet connection
- `npx` available (comes with Node.js)

> **Note:** `vite.config.ts` already includes `server.allowedHosts: ['.trycloudflare.com']`, so Vite will accept requests from any `*.trycloudflare.com` tunnel URL without extra configuration.

## Instructions

### Step 1 — Confirm the dev server is running

Ask the user if their dev server is already running. If not, remind them to start it:

```bash
pnpm run dev
```

The default port is `5173`. If they're using a different port, note it for Step 2.

### Step 2 — Start the tunnel

In a **separate terminal window**, run:

```bash
npx cloudflared tunnel --url http://localhost:5173
```

- If this is the first time running it, the user will be prompted to confirm installation of the `cloudflared` package — they should accept.
- Replace `5173` with the actual port if different.

### Step 3 — Find the public URL

The command produces a lot of output. Look for a line like:

```
Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):
https://some-random-words.trycloudflare.com
```

That `https://*.trycloudflare.com` URL is the shareable link. Copy it and send it to whoever needs to see the prototype.

### Step 4 — Share the link

Give the URL to the user and remind them:

- The link is **publicly accessible** — anyone with the URL can view the site
- It stays active as long as the `cloudflared` process is running in the terminal
- To stop sharing, press `Ctrl+C` in the terminal running cloudflared
- The URL is randomly generated and changes each time you restart the tunnel

## Important Caveats

- **Free tier, not production-grade** — this is Cloudflare's complimentary quick tunnel service. It's great for demos and feedback, not for serving real users.
- **Temporary** — the URL expires when you stop the process. There's no persistence.
- **Performance** — latency may be higher than localhost since traffic routes through Cloudflare's network.
- **No auth** — anyone with the link can access your local server. Don't share sensitive data.
- **200 concurrent request limit** — the tunnel can handle up to 200 requests being processed at the exact same moment. In practice this means roughly 200 people actively clicking around at once — well beyond what a prototype demo needs. If you somehow hit it, visitors will see an error until traffic drops back down.
- **No real-time/streaming support** — quick tunnels don't support Server-Sent Events (SSE). If the app uses live-updating features (like a real-time feed or streaming AI responses), those won't work through the tunnel.

## Troubleshooting

| Problem | Solution |
|---|---|
| "command not found: npx" | Node.js isn't installed or not in PATH. Run the `setup-environment` skill. |
| Tunnel starts but URL isn't reachable | Wait 10–15 seconds. Quick tunnels can take a moment to propagate. |
| Connection refused errors | Make sure your dev server is actually running on the specified port. |
| Tunnel disconnects frequently | Check your internet connection. Restart the tunnel if needed. |
| Need a stable URL that doesn't change | This free service doesn't support that. Consider deploying to Vercel or GitLab Pages instead. |

## Reference

- Cloudflare docs: https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/
