import { markdownHtmlFromGetContext } from '@relay/md';
import { queryWidth, optimizeRasterFromGetContext } from '@relay/image';
import { resolveIpfsFromGetContext, fetchIpfsBytesFromGetContext } from '@relay/ipfs';

export default function run(ctx, next) {
  var ipfsOpts = { sources: ["inline", "manifest"], manifestPath: "assets.manifest.json" };

  var html = markdownHtmlFromGetContext(ctx);
  if (html !== null) { return html; }

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
