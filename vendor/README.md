# Local Vendor Dependencies

This folder is for third-party files copied into the repository. It does not mean vendor-side or cloud rendering.

## `three.min.js`

Three.js r124 classic browser build, originally vendored so the prototype could work from a local `file://` URL without requiring a dev server.

The public prototype currently does not load this file by default. Local WebGL preview should remain opt-in because the default observatory viewport is intended to display pre-rendered or vendor-rendered frames.

License: MIT. See the license header in `three.min.js`.
