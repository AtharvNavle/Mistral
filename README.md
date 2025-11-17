## Mentor Lounge

Mentor Lounge is a multi-thread mentor workspace built with Next.js 16 (App Router) and Tailwind. It showcases Mistral’s public API by letting you juggle multiple personas, capture summaries, review analytics, and share read-only conversations without leaking API keys to the client.

### Feature tour

- **Persona-aware threads**: Sidebar keeps separate sessions per mentor type (Product Mentor, Code Reviewer, Delivery PM). Threads can be pinned, archived, or deleted and persist locally via Zustand.
- **Structured composer**: Quick action chips (bug triage, spec rewrite, retro) inject templates; the composer shows streaming state while messages flow through the Mentor API.
- **Server-only AI calls**: `/api/chat` and `/api/summary` wrap the official `@mistralai/mistralai` SDK so the `MISTRAL_API_KEY` never leaves the server.
- **Utility rail**: Persona detail, rolling summary (auto-updated after each exchange), lightweight analytics (turns, duration, user vs mentor counts), and a one-click share link.
- **Share view**: `/share/[payload]` decodes read-only payloads to show the transcript + highlights without requiring auth or additional storage.

### Requirements

- Node.js **20.9.0 or newer** (Next.js 16 enforces this). Recommended managers: `nvm-windows`, Volta, or the official Node installer.
- npm 9+ (bundled with Node 20).

### Setup & local development

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Open `.env.local` and set:

   ```
   MISTRAL_API_KEY=sk-your-real-key
   ```

   `.gitignore` already excludes `.env*`, so the key stays out of source control.

3. **Run the app**

   ```bash
   npm run dev
   ```

   The dev server defaults to port 3000 (use `PORT=4100 npm run dev` to override).

4. **Lint (optional but recommended)**

   ```bash
   npm run lint
   ```

### Manual test script

Use these steps to validate the whole experience after starting `npm run dev`:

1. **Create a Product Mentor thread**
   - Select the “Product Mentor” pill.
   - Click “Start new thread”.
   - Paste:
     ```
     Context: We're launching Mentor Lounge. Goals: improve onboarding, reduce repetitive summaries,
     and add a lightweight sharing workflow. Suggest a two-sprint plan.
     ```
   - Click Send and confirm a mentor response arrives.

2. **Verify summary + analytics**
   - Look at the right rail: “Session summary” should show fresh bullets.
   - “Session analytics” should show Turns ≥ 2, Duration ≥ 1m after a follow-up.

3. **Use quick actions**
   - Click “Retro outline” quick action, replace `<insert context>` with a few notes, and send.
   - Ensure the mentor response adjusts to the template.

4. **Share link**
   - Click “Share thread → Copy share link”.
   - Open the copied URL in an incognito window and confirm the transcript + bullets render.

5. **Thread controls**
   - In the sidebar, pin the thread, archive it, then delete it to test all actions.
   - Start a Code Reviewer thread to ensure persona-specific prompts still work.

6. **API sanity checks (optional)**
   - `curl http://localhost:3000/api/chat -X POST -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"hi"}]}'`
   - `curl http://localhost:3000/api/summary -X POST -H "Content-Type: application/json" -d '{"transcript":"USER: hi\\n\\nASSISTANT: hello"}'`
   - Both should return JSON payloads without errors.

### Key directories

- `src/components/chat` – Thread sidebar, composer, analytics, share panel, share card, etc.
- `src/store/chat-store.ts` – Zustand store (persisted threads, statuses, summaries).
- `src/lib/mistral.ts` – Thin wrapper around `@mistralai/mistralai`.
- `src/app/api/chat/route.ts` – Server-only proxy for chat completions.
- `src/app/api/summary/route.ts` – Summaries powered by the same client.
- `src/app/share/[payload]/page.tsx` – Public read-only view of shared payloads.

### Roadmap

- [x] UI architecture + state model
- [x] Wire mentor responses + summaries via API routes
- [x] Lightweight analytics + shareable read-only links
- [ ] Persist histories in a shared database
- [ ] Voice extensions and real-time co-tap
