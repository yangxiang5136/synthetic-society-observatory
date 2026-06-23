# Render Pipelines

Synthetic Society Observatory can use several visual-generation paths. These paths should stay modular: generated images and rendered scenes are viewport assets, not proof of a live runtime.

## 1. Fast Concept Path

Use image generation or selected concept renders to explore visual language quickly.

Good for:

- street-level cinematic mood;
- observer-deck mood;
- public-video look development;
- rapid visual A/B decisions.

Current integrated assets:

- `assets/cyberpunk-observatory-viewport.png` - high-level overview.
- `assets/street-event-wide.png` - street-level cinematic view.
- `assets/street-event-cinematic.webp` - alternate street-level view.
- `assets/observer-deck-view.png` - observer-deck cinematic UI view.

## 2. Default Spatial Video Viewport Path

Use pre-rendered stills, rendered clips, spatial orbit videos, or frame manifests as the default public UI path. The browser should display returned assets and handle selection state, not continuously render the world locally.

Current scope:

- fixed, one-screen observatory console;
- overview, observer, and first-person view switching;
- timeline and event selection mapped to selected media assets;
- dawn, day, dusk, and night labels linked to the timeline;
- local WebGL render loop disabled by default.

Expected vendor-side flow:

1. A scenario or observer slice becomes a render request.
2. A vendor render lane produces stills, spatial video, transition clips, or a frame manifest.
3. Returned assets are stored under `assets/` or a future CDN bucket.
4. The UI displays those assets and updates metadata panels.

Boundary:

- "Vendor-side rendering" means Hugging Face, Blender node, cloud GPU, Replicate-like endpoint, or another external render worker.
- A local `vendor/` dependency folder is not vendor-side rendering.
- The UI must not claim a rendered frame is a live runtime or real prediction.
- See `docs/SPATIAL_VIDEO_RENDER_CONTRACT.md` for the current media contract.

## 3. Remote GPU Interactive Path

Use remote GPU pixel streaming when the page needs smooth 360-degree camera control without shifting scene rendering onto each visitor's laptop.

Current prototype scope:

- target selection for overview, observer deck, first-person, and each visible agent;
- yaw, pitch, and zoom controls;
- staged `sso.remote-render-control.v0` packets exposed to the page;
- pre-rendered orbit media as the no-endpoint fallback.

Expected remote flow:

1. A render gateway creates or attaches a remote GPU session.
2. The browser sends camera and observatory-state packets.
3. The renderer updates the loaded 3D scene and camera.
4. A WebRTC stream returns the rendered pixels to the browser.

Boundary:

- This path still involves real-time rendering, but the render cost belongs to the remote GPU service.
- The public browser should decode video and send controls, not run the scene render loop.
- See `docs/REMOTE_GPU_RENDERING.md` and `render-manifests/remote-gpu-session-v0.json`.

## 4. Optional Local 3D Preview Path

Use a local Three.js viewport only as an opt-in preview or development experiment, not as the default public path. This mode runs in the viewer's browser and can use local CPU/GPU resources.

Current scope:

- modular city blocks, roads, agents, event core, and cause lines;
- overview, observer, and first-person cameras;
- 00:00-23:59 timeline;
- day, dusk, and night lighting linked to the timeline;
- event playback nodes linked to active module, active agent, and scene diffusion intensity;
- fallback images if the 3D stage cannot start.

Boundary:

- This is an embodied visual model, not a live society runtime.
- Geometry is intentionally lightweight and neutral.
- Private modules should still enter only through explicit event manifests.
- This path should stay disabled unless a developer explicitly opts into local preview.

## 5. Hugging Face MCP Path

Hugging Face MCP or similar model endpoints can be used as a render lane for concept images when the goal is fast exploration.

Recommended use:

1. Generate 3-6 candidates for the same event.
2. Keep each candidate neutral: no private brands or project-specific terms.
3. Select one image per perspective type: overview, street, deck.
4. Copy selected assets into `assets/`.
5. Document the role of the asset in `assets/README.md`.

This path is useful because it can produce cinematic scene variety faster than a full 3D scene build.

## 6. Windows Blender Render Node

The Windows render node should be used when the scene needs to become reproducible, animated, or tied to future `observer_slices -> render_shotlist` output.

Recommended use:

1. Treat selected concept images as look-development references.
2. Build or generate a Blender shotlist from an observer slice.
3. Render overview, street, or deck shots through the Windows node.
4. Return stills or clips as viewport assets.

Use this path for:

- repeatable 3D stills;
- camera moves;
- public-video sequences;
- future observer-slice-to-shot workflows.

## Boundary

Do not claim that any concept image or Blender render is a live simulation. Until runtime integration exists, the UI should keep labels such as `staged observer UI`, `public-safe seed`, and `render asset`.
