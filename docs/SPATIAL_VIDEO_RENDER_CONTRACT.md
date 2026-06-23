# Spatial Video Render Contract

Synthetic Society Observatory should feel like a living 3D observatory without making every public visitor render a 3D scene locally.

The default static-media model is:

1. Build or load the actual 3D scene on a render worker.
2. Render camera paths, viewpoint transitions, day/night variants, and event variants as media.
3. Publish video, poster frames, and metadata to static storage or a CDN.
4. Let the public webpage display media and update UI state only.

The future interactive model is remote GPU rendering:

1. Keep the 3D scene loaded on a remote GPU worker.
2. Send camera controls from the browser.
3. Render the requested viewpoint remotely.
4. Stream the resulting pixels back through WebRTC or an equivalent low-latency transport.

See `docs/REMOTE_GPU_RENDERING.md` for that protocol.

## Browser Runtime Rule

The public browser runtime should remain video-first:

- play MP4/WebM/HLS assets;
- seek to viewpoint anchors;
- send yaw, pitch, zoom, target, time, event, and agent controls when a remote endpoint exists;
- show HTML overlays for selected agent, time, view, and event;
- avoid WebGL unless a developer explicitly enables a local preview mode.

This means the visitor's machine performs media decoding and UI control work, not scene rendering.

## Viewpoint Model

The observatory needs smooth 360-degree viewpoint movement at two levels:

- `overview` - high-dimensional social overview;
- `observer` - third-person observer deck / causal replay;
- `first` - street-level or selected-agent-adjacent view.
- selected agents - 360-degree orbit around each visible person.

In the current static prototype, yaw maps to an anchor inside a pre-rendered orbit video. Later media versions can replace one loop with explicit transition clips:

- `overview_to_observer.mp4`
- `observer_to_first.mp4`
- `first_to_overview.mp4`

In the remote GPU version, the interaction stays the same but the renderer answers camera controls in real time.

## Day And Night

Do not recolor a single render if visual truth matters. The render worker should output separate lighting states:

- dawn;
- day;
- dusk;
- night.

The timeline chooses the correct media group. The current prototype uses one demo loop while keeping the manifest ready for separate variants.

## Event Variants

Events should be render parameters, not hard-coded UI claims. A future render request can include:

```json
{
  "event_id": "evt_0042",
  "viewpoints": ["overview", "observer", "first"],
  "time_phase": "night",
  "selected_agent": "agent-001",
  "module_manifest": "neutral_module_manifest.json",
  "outputs": ["mp4", "poster", "camera_path_json"]
}
```

## Optional Spatial Buffers

If the render worker can output depth, normals, or motion vectors, keep them as optional production assets. Do not require them for the public page unless a specific experience needs them.

Useful optional outputs:

- depth EXR sequence;
- normal EXR sequence;
- motion-vector EXR sequence;
- camera path JSON;
- object/id matte passes.

These enable later editing and compositing. They are not required for the visitor's browser.

## Current V0 Asset

`assets/spatial-orbit-v0.mp4` is a lightweight proof that the page can consume a dynamic pre-rendered viewport asset with no local WebGL. It was generated through the Windows Blender render node from `render-jobs/blender_spatial_orbit_v0.py`.

It is not the final production 3D scene and does not claim live simulation.
