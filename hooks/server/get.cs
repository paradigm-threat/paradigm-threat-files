import { markdownHtmlFromGetContext } from '@relay/md';
import { fetchIpfsBytesFromGetContext, resolveIpfsFromGetContext } from '@relay/ipfs';
import { queryWidth, optimizeRasterFromGetContext } from '@relay/image';

export default function run(ctx, next) {
  /* .md → HTML */
  var html = markdownHtmlFromGetContext(ctx);
  if (html !== null) { return html; }

  /* Width from ctx.query; resize only when hook passes bytes + explicit width */
  var maxW = queryWidth(ctx);
  if (maxW !== null) {
    var bytes = fetchIpfsBytesFromGetContext(ctx);
    if (bytes !== null) {
      var webp = optimizeRasterFromGetContext(ctx, bytes, { width: maxW });
      if (webp !== null) { return webp; }
    }
    return next();
  }

  /* Full file (default centralDir: .relay/assets/{relPath}.ipfs) */
  var file = resolveIpfsFromGetContext(ctx);
  if (file !== null) { return file; }

  return next();
}
