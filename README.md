# ekubobits

**ekubobits** is a read-only inspector and JSON API for [**Ekubo**](https://docs.ekubo.org/) **extension call points** on [**Starknet**](https://www.starknet.io/). Paste an extension contract address, read `Core.get_call_points` over JSON-RPC, and see which of the eight lifecycle hooks are registered — plus a packed mask byte, Voyager links, and shareable URLs.

Same product shape as [**hookbits**](https://hookbits.vercel.app) (permission literacy for hook-style integrations), but **Starknet-correct**: registration lives on **Ekubo Core**, not in Uniswap v4–style address bits.

MIT licensed · No wallet · No transactions · No custody · Built for the [Starknet Foundation Seed Grant](https://www.starknet.io/grants/seed-grants/) program.

---

## Live (for reviewers)

| Item | URL |
|------|-----|
| **App** | https://ekubobits.vercel.app/ |
| **GitHub** | https://github.com/panagot/ekubobits |
| **API docs** | https://ekubobits.vercel.app/api-docs |
| **Try Oracle (Sepolia)** | https://ekubobits.vercel.app/?network=sepolia&extension=0x003ccf3ee24638dd5f1a51ceb783e120695f53893f6fd947cc2dcabb3f86dc65 |

**30-second check:** open the Oracle link above → you should see mask `0x51` and three active hooks (`before_initialize_pool`, `before_swap`, `before_update_position`) fetched live from Ekubo Core on Sepolia.

---

## Problem

Ekubo extensions on Starknet register which lifecycle hooks they may run via **`set_call_points`** on **Ekubo Core**; integrators read them back with **`get_call_points`**. Official docs describe the eight call points, but there is no standard public tool that:

- maps an extension address → human-readable hook flags from **chain state**;
- exposes the same decode over a **stable HTTP API** for scripts and CI;
- documents known Oracle / TWAMM / limit-order deployments with deep links.

Teams otherwise repeat the same RPC plumbing — errors show up as silent integration failures (“deployed, but hooks never fire as expected”).

---

## What's shipped

| Route | What it does | Status |
|-------|----------------|--------|
| `/` | Call-point inspector — Sepolia/mainnet, live RPC, URL state, QR share, recent addresses | shipped |
| `/extensions` | Known Ekubo extensions (Oracle, TWAMM, limit orders) with Voyager + inspector links | shipped |
| `/register` | Toggle eight call points, preview mask byte, copy Cairo-shaped `CallPoints` scaffold (`?mask=` deep link) | shipped |
| `/api-docs` | HTTP API reference with curl examples | shipped |
| `/about` | Starknet Core vs EVM Ekubo; relation to hookbits | shipped |
| `/faq` | Eight common questions for builders | shipped |
| `GET /api/call-points` | Machine-readable `get_call_points` decode | shipped |
| `GET /api/extensions` | Registry merge (`lib/ekubo-contracts.ts` + `data/extensions.json`) | shipped |

Vitest covers mask encode/decode and pinned Sepolia RPC felts for all three documented extensions (`tests/fixtures/extension-call-points.json`).

---

## Grant roadmap (2 × $2,000 milestones)

The MVP above is live before grant execution. Funding completes **compare + education** surfaces:

| Milestone | Focus | Deliverables |
|-----------|--------|--------------|
| **M1** | Compare & audit surface + CI | `/compare` (two extensions or live vs expected mask), `POST /api/compare`, GitHub Actions (test + build on PRs), updated API docs |
| **M2** | Education kit & integrator traction | `/glossary` (all eight hooks), `/lifecycle` (hook placement in swap/position/fee flows), `/cookbook` (≥5 recipes), adoption references in Ekubo/Starknet channels |

---

## HTTP API

Production examples (read-only; responses cached ~60s):

```bash
# Oracle extension on Sepolia — expect maskHex 0x51
curl -sS "https://ekubobits.vercel.app/api/call-points?network=sepolia&extension=0x003ccf3ee24638dd5f1a51ceb783e120695f53893f6fd947cc2dcabb3f86dc65"

# Known extensions registry
curl -sS "https://ekubobits.vercel.app/api/extensions"
```

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/call-points?network=…&extension=…` | Query Core `get_call_points`; returns `callPoints`, `maskByte`, `maskHex`, `activeNames`, `registered`, `fetchedAt`, addresses |
| `GET` | `/api/extensions` | Merge of built-in deployments and `data/extensions.json` metadata |

Success body (abbreviated):

```json
{
  "ok": true,
  "maskHex": "0x51",
  "activeNames": ["before_initialize_pool", "before_swap", "before_update_position"],
  "network": "sepolia",
  "registered": true,
  "fetchedAt": "2026-05-21T18:34:02.766Z"
}
```

Errors: **400** invalid address · **502** RPC failure (`ok: false`, `message` explains).

---

## Known extensions (pinned masks)

| Extension | Sepolia mask | Mainnet |
|-----------|--------------|---------|
| Oracle | `0x51` | deployed — see `/extensions` |
| TWAMM | `0xd5` | deployed — see `/extensions` |
| Limit orders | `0x31` | deployed — see `/extensions` |

Addresses and Core contract IDs follow [Ekubo Starknet contracts](https://docs.ekubo.org/integration-guides/reference/starknet-contracts) (`lib/ekubo-contracts.ts`).

---

## Background: Starknet vs EVM Ekubo

On EVM, Ekubo can encode permissions in the **top byte** of the extension address (similar in spirit to Uniswap v4 hook bits). On Starknet, permissions are **registered on Ekubo Core** — ekubobits always reflects **chain truth from Core**, not heuristics from the address alone. The inspector may show an address “hint byte” for comparison; that grid is informational until you click **Read from Core**.

---

## Local development

**Requirements:** Node.js **20+**, npm **10+**

```bash
git clone https://github.com/panagot/ekubobits
cd ekubobits
npm install
npm run dev
```

Dev server: http://localhost:3003

```bash
npm run build    # production build
npm start        # serve production output
npm run test     # Vitest (5 tests)
npm run typecheck
```

### Configuration

Copy `.env.example` to `.env.local`:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_STARKNET_SEPOLIA_RPC` | Override Sepolia JSON-RPC URL |
| `NEXT_PUBLIC_STARKNET_MAINNET_RPC` | Override mainnet JSON-RPC URL |
| `NEXT_PUBLIC_GITHUB_URL` | Repository URL for header/footer links |

Defaults target stable public nodes (PublicNode — see `lib/ekubo-contracts.ts`).

---

## Stack

- Next.js 16 (App Router)
- React 19 · TypeScript 5 (strict)
- Tailwind CSS v4
- `starknet` (`RpcProvider`, `callContract` → `get_call_points`)
- TanStack Query · nuqs (URL state) · Zod (API validation) · Vitest

---

## Repository layout

| Path | Role |
|------|------|
| `app/` | App Router pages and route handlers |
| `components/` | UI (inspector, layout, primitives) |
| `lib/` | Call-point encoding, RPC helpers, registry merge |
| `data/extensions.json` | Extra registry fields (tags, docs URLs) |
| `tests/` | Vitest specs and RPC-shaped fixtures |

---

## Contributing extensions

Add or update entries in **`data/extensions.json`** (metadata) and, when addresses change, **`lib/ekubo-contracts.ts`** (canonical deployments). Keep entries aligned with [Ekubo Starknet contract reference](https://docs.ekubo.org/integration-guides/reference/starknet-contracts).

---

## References

- [Ekubo Starknet contracts](https://docs.ekubo.org/integration-guides/reference/starknet-contracts)
- [Ekubo extensions](https://docs.ekubo.org/integration-guides/extensions)
- [Ekubo EVM callPoints layout](https://github.com/EkuboProtocol/evm-contracts/blob/main/src/types/callPoints.sol) (mask byte shared with Cairo)

---

## License

MIT — see [`LICENSE`](LICENSE).

---

## Disclaimer

ekubobits is an independent tool. It is **not** affiliated with Ekubo Protocol, Starknet Foundation, or Uniswap.
