# Publishing n8n-nodes-octabiz

The package is build-clean and `npm publish`-ready. Everything below runs from
**the owner's npm account** — Claude cannot log in for you.

## Where it gets seen — two very different bars

1. **Installable community node (done).** Published to npm as `n8n-nodes-octabiz`.
   Self-hosted users install it by exact name from **Settings → Community nodes**.
   This does **not** put it in the public directory or the in-app node search.
2. **Listed on n8n.io/integrations + in-app search (verification required).**
   Only *verified* nodes appear there. Verification (as of 1 May 2026) requires
   the package be **published with npm provenance**, which can only be generated
   from CI — a laptop `npm publish` fails the scanner. See "Get verified" below.

## One-time: publish to npm

```bash
cd integrations/n8n
npm install
npm run build          # tsc -> dist/, copies the icon (verified clean, exit 0)
npm login             # owner's npmjs.org account
npm publish --access public
```

`prepublishOnly` re-runs the build automatically, so the published tarball always
contains fresh `dist/`. Confirm the contents first with:

```bash
npm publish --dry-run  # lists the 10 files that ship (~5 kB tarball)
```

## Releasing an update

Bump `version` in `package.json` (npm rejects a re-publish of the same version),
then `npm publish` again.

## Get verified (to appear on n8n.io/integrations)

A plain `npm publish` makes the node installable but keeps it out of the public
directory and in-app search. To be listed, the node must be **verified**, and
verification requires npm **provenance**.

1. **Publish with provenance from CI.** Use the repo workflow
   `.github/workflows/publish-n8n-node.yml`:
   - Owner adds an npm **Automation** token as the GitHub secret `NPM_TOKEN`.
   - Bump `version` in `package.json`, commit, then run the workflow from the
     **Actions** tab (or push a `n8n-v*` tag). It runs `npm publish --provenance`.
2. **Check it passes the scanner:**
   ```bash
   npx @n8n/scan-community-package n8n-nodes-octabiz
   ```
   (A laptop publish fails this with "not published with npm provenance".)
3. **Submit for verification** through the n8n Creator Portal:
   https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/

Other verification rules this package already meets: name starts with
`n8n-nodes-`, has the `n8n-community-node-package` keyword, TypeScript, English
only, one third-party service, a README, and **no runtime dependencies**.

## Test locally before publishing

```bash
cd integrations/n8n && npm run build && npm link
cd ~/.n8n/nodes && npm link n8n-nodes-octabiz
```

Restart n8n, add the **Octabiz API** credential with an `oc_live_` key, and the
**Octabiz** node appears in the editor.
