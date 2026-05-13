import { markdownHtmlFromGetContext } from '@relay/md';
import { optimizeRasterFromGetContext } from '@relay/image';

export default function run(ctx, next) {
  var html = markdownHtmlFromGetContext(ctx);
  var optimized = optimizeRasterFromGetContext(ctx);
  return html !== null ? html : optimized !== null ? optimized : next();
}
