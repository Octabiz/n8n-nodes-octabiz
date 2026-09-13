# n8n-nodes-octabiz

An [n8n](https://n8n.io) community node for Octabiz, built on the
[Octabiz Connect](../../docs/connect/getting-started.md) public API.

## What it does

One **Octabiz** node with these resources and operations:

- **Customer, Invoice, Product, Lead or Deal, Sales Order**
- **Create** a record, or **Get Many** (list newest first)
- Invoice and Order support line items

**Credential:** *Octabiz API* — an `oc_live_` key from Octabiz (Settings > API
keys), sent as a bearer token and tested against `GET /v1/me`.

## Build & install

```bash
cd integrations/n8n
npm install
npm run build          # tsc -> dist/, copies the icon
```

Then either publish to npm and install it from **Settings > Community nodes** in
n8n:

```bash
npm publish            # publishes n8n-nodes-octabiz
```

or link it into a self-hosted n8n for testing:

```bash
npm link
cd ~/.n8n/nodes && npm link n8n-nodes-octabiz
```

Restart n8n, add the **Octabiz API** credential with your key, and the
**Octabiz** node appears in the editor.

## Layout

- `credentials/OctabizApi.credentials.ts` — API-key credential + test
- `nodes/Octabiz/Octabiz.node.ts` — declarative node (routing to `/v1/*`)
- `nodes/Octabiz/octabiz.svg` — node icon

## Roadmap

Trigger support (via the Connect webhooks platform) is a planned follow-up;
today the node covers reads and writes.
