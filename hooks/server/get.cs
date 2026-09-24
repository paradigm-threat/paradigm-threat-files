import { markdownHtmlFromGetContext } from '@relay/md';
import { ssrClientHookFromGetContext } from '@relay/ssr';
import { pinnedPrefix } from '@relay/web-assets';
import { queryWidth, optimizeRasterFromGetContext } from '@relay/image';
import { resolveIpfsFromGetContext, fetchIpfsBytesFromGetContext } from '@relay/ipfs';

function wantsSiteShell(ctx) {
  try { if (ctx.embedMarkdownRequest === true) return true; } catch (e) {}
  try { if (ctx.siteShellRequest === true) return true; } catch (e) {}
  return false;
}

function isAssetStatusFile(file) {
  if (file === null) return false;
  try {
    var ct = file.contentType;
    if (typeof ct !== 'string') return false;
    if (ct.indexOf('application/vnd.relay.asset-status') >= 0) return true;
  } catch (e) {}
  return false;
}

export default function run(ctx, next) {
  if (wantsSiteShell(ctx)) {
    var ssr = ssrClientHookFromGetContext(ctx, { clientHookPath: "hooks/client/get.jsx" });
    if (ssr !== null) { return ssr; }
    // SSR miss: return next(). Gateway may still try static @relay/md on Accept-only
    // (markdownHtmlRequest) — that path is repo-optional, not site chrome.
    return next();
  }

  var html = markdownHtmlFromGetContext(ctx);
  if (html !== null) { return html; }

  // Fat repo: Git binaries at public paths first. Never use legacy "inline"
  // relay-ipfs-v1 stubs at .png/.jpg paths — IPFS index is assets.manifest.json
  // (and optional .relay/assets/*.ipfs), not text files with media extensions.
  // optimizeRaster requires opts.width — a bare ctx call always returns null.
  var maxW = queryWidth(ctx);
  if (maxW !== null) {
    var optimized = optimizeRasterFromGetContext(ctx, null, { width: maxW });
    if (optimized !== null) { return optimized; }
  }

  var ipfsOpts = { sources: ["manifest"], manifestPath: "assets.manifest.json" };
  if (maxW !== null) {
    var bytes = fetchIpfsBytesFromGetContext(ctx, ipfsOpts);
    if (bytes !== null && !isAssetStatusFile(bytes)) {
      var webp = optimizeRasterFromGetContext(ctx, bytes, { width: maxW });
      if (webp !== null) { return webp; }
    }
  }

  var file = resolveIpfsFromGetContext(ctx, ipfsOpts);
  if (file !== null && !isAssetStatusFile(file)) { return file; }

  return next();
}
