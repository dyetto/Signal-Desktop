// Copyright 2021-2022 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

/* global window */

const { ipcRenderer } = require('electron');
const fastGlob = require('fast-glob');

window.assert = require('chai').assert;

// This is a hack to let us run TypeScript tests in the renderer process. See the
//   code in `test/index.html`.

window.test = {
  onComplete(info) {
    return ipcRenderer.invoke('ci:test-electron:done', info);
  },
  prepareTests() {
    fastGlob
      .sync('./ts/test-{both,electron}/**/*_test.js', {
        absolute: true,
        cwd: __dirname,
      })
      .forEach(require);
  },
};
