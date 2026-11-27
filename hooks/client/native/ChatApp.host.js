/**
 * Legacy fb-chat-app native host — retired.
 * Clevertree Chat owns the room; this host no longer builds mesh ChatApp UI.
 */
(function (global) {
  'use strict';
  function noopMount(node) {
    if (!node) return;
    try {
      node.setAttribute('data-ct-retired', 'chatapp');
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
    global.RelayParkChatApp = api;
  } catch (e) {}
})(typeof globalThis !== 'undefined' ? globalThis : this);
