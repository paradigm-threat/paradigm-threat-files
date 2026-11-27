/**
 * Legacy fb-live-chat native host — retired.
 * Clevertree Chat owns the room; this host no longer builds mesh LiveChat UI.
 * Kept as a no-op registrar so old asset catalogs do not 404.
 */
(function (global) {
  'use strict';
  function noopMount(node) {
    if (!node) return;
    try {
      node.setAttribute('data-ct-retired', 'livechat');
      node.textContent = '';
    } catch (e) {}
  }
  var api = {
    mount: noopMount,
    hydrate: noopMount,
    build: function () {
      return null;
    },
  };
  try {
    global.RelayParkLiveChat = api;
  } catch (e) {}
  try {
    if (global.document && global.customElements) {
      // no custom element — Clevertree ChatRoomLive / overlay own the UX
    }
  } catch (e2) {}
})(typeof globalThis !== 'undefined' ? globalThis : this);
