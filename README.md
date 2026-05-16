# ekubobits

Inspector and HTTP API for [**Ekubo**](https://docs.ekubo.org/) **extension call points** on [**Starknet**](https://www.starknet.io/). Given an extension contract address, the app reads `Core.get_call_points` over JSON-RPC and surfaces the eight Ekubo lifecycle hooks, a packed mask byte, and shareable URLs.

ekubobits is developer tooling only: no wallet connection, no transactions, no custody.

## Background

On Starknet, Ekubo registers which hooks an extension may run via **`set_call_points`** on **Ekubo Core**; integrators read them back with **`get_call_points`**. This differs from Uniswap v4–style tooling where permissions can be reflected in address bits; here, **chain state on Core is the source of truth**.

The project shares goals with [**hookbits**](https://hookbits.vercel.app) (clarity for hook-style permissions) but targets Starknet’s Core-backed model.

## Features

- **Inspector** — Sepolia / mainnet, live RPC read, URL state (`network`, `extension`), QR share, recent addresses (local storage).
- **Extension registry** — Documented Oracle, TWAMM, and limit-order deployments with links to Voyager and the inspector.
- **Registration builder** — Toggle the eight call points, preview mask byte, copy a Cairo-shaped `CallPoints` scaffold (`?mask=` deep link supported).
- **API** — Same-origin JSON endpoints for automation and integrations.

## Requirements

- Node.js **20+** (LTS recommended)
- npm **10+**

## Getting started

```bash
npm install
npm run dev
```

The dev server listens on [**http://localhost:3003**](http://localhost:3003) (see `package.json`).

```bash
npm run build    # production build
npm start        # serve production output
npm run test     # Vitest
npm run typecheck
```

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Call-point inspector |
| `/extensions` | Known Ekubo extensions (Sepolia / mainnet) |
| `/register` | Mask preview and Cairo template |
| `/api-docs` | HTTP API documentation |
| `/about` | Starknet vs EVM Ekubo; relation to hookbits |
| `/faq` | Common questions |

## HTTP API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/call-points?network=…&extension=…` | Query Core `get_call_points`; returns `callPoints`, `maskByte`, `maskHex`, `activeNames`, `registered`, `fetchedAt`, addresses |
| `GET` | `/api/extensions` | Merge of built-in deployments and `data/extensions.json` metadata |

Responses use short `Cache-Control` hints suitable for CDN caching.

## Configuration

Copy `.env.example` to `.env.local` and set variables as needed:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_STARKNET_SEPOLIA_RPC` | Override Sepolia JSON-RPC URL |
| `NEXT_PUBLIC_STARKNET_MAINNET_RPC` | Override mainnet JSON-RPC URL |
| `NEXT_PUBLIC_GITHUB_URL` | Repository URL for header/footer links (defaults to this repo) |

Default RPC endpoints target stable public nodes (see `lib/ekubo-contracts.ts`).

## Repository layout

| Path | Role |
|------|------|
| `app/` | Next.js App Router pages and route handlers |
| `components/` | UI (inspector, layout, primitives) |
| `lib/` | Call-point encoding, RPC helpers, registry merge |
| `data/extensions.json` | Extra registry fields (tags, docs URLs); merged with `lib/ekubo-contracts.ts` |
| `tests/` | Vitest specs and RPC-shaped fixtures |

## Contributing extensions

Add or update entries in **`data/extensions.json`** (metadata) and, when addresses change, **`lib/ekubo-contracts.ts`** (canonical deployments). Keep entries aligned with [Ekubo Starknet contract reference](https://docs.ekubo.org/integration-guides/reference/starknet-contracts).

## References

- [Ekubo Starknet contracts](https://docs.ekubo.org/integration-guides/reference/starknet-contracts)
- [Ekubo extensions](https://docs.ekubo.org/integration-guides/extensions)

## License

MIT — see [`LICENSE`](LICENSE).

## Disclaimer

ekubobits is an independent tool. It is **not** affiliated with Ekubo Protocol, Starknet Foundation, or Uniswap.
