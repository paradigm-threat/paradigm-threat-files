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

export default function run(ctx, next) {
  if (wantsSiteShell(ctx)) {
    var ssr = ssrClientHookFromGetContext(ctx, { clientHookPath: "hooks/client/get.jsx" });
    if (ssr !== null) { return ssr; }
  }

  var html = markdownHtmlFromGetContext(ctx);
  if (html !== null) { return html; }

  var ipfsOpts = { sources: ["inline", "manifest"], manifestPath: "assets.manifest.json" };
  var maxW = queryWidth(ctx);
  if (maxW !== null) {
    var bytes = fetchIpfsBytesFromGetContext(ctx, ipfsOpts);
    var webp = optimizeRasterFromGetContext(ctx, bytes, { width: maxW });
    if (webp !== null) { return webp; }
  }
  var file = resolveIpfsFromGetContext(ctx, ipfsOpts);
  if (file !== null) { return file; }
  var optimized = optimizeRasterFromGetContext(ctx);
  if (optimized !== null) { return optimized; }
  return next();
}
