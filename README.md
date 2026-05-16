# ekubobits

Read-only inspector for **Ekubo extension call points** on Starknet — the Starknet analogue of [hookbits](https://hookbits.vercel.app) for Uniswap v4 hooks.

Paste an extension contract address, choose Sepolia or mainnet, and read `Core.get_call_points` to see which of the eight Ekubo hooks are registered. Share deep links with `?network=&extension=`.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3003](http://localhost:3003).

## Routes (Phase 1)

| Path | Description |
|------|-------------|
| `/` | Inspector · nuqs URL state · react-query RPC · QR share |
| `/extensions` | Known Oracle / TWAMM / Limit-order cards → inspector |
| `/register` | Toggle call points · Cairo template · `?mask=0x51` deep link |
| `/api-docs` | HTTP API reference + curl examples |
| `/about` | Starknet vs EVM Ekubo · hookbits relation |
| `/faq` | Common builder questions |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port **3003**) |
| `npm run build` | Production build |
| `npm run test` | Vitest (`tests/`, fixtures under `tests/fixtures/`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | Alias for `typecheck` (full ESLint preset blocked on some Node installs) |
| `npm start` | Production server |

## API

```http
GET /api/call-points?network=sepolia|mainnet&extension=0x...
GET /api/extensions
```

Success payloads include `maskByte`, `maskHex`, `activeNames`, `fetchedAt`, and `callPoints` booleans.

## Registry PRs

Extend `data/extensions.json` (tags, docs) — merged in code with canonical addresses in `lib/ekubo-contracts.ts`.

## Optional env

Copy `.env.example` to `.env.local` for RPC overrides. Set `NEXT_PUBLIC_GITHUB_URL` if the footer/header repo link should not default to `panagot/ekubobits`.

## Screenshots (for grants / README)

_Add after deploy: inspector decode, extensions grid, register builder, API docs._

## References

- [Ekubo Starknet contracts](https://docs.ekubo.org/integration-guides/reference/starknet-contracts)
- Core stores call points via `set_call_points` / `get_call_points` (not address-bit mining like EVM Ekubo top-byte encoding)
