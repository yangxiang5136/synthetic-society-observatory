# Remote GPU Rendering Contract

Synthetic Society Observatory should eventually support smooth 360-degree viewpoint changes without asking each visitor's computer to render the world locally.

The intended production path is remote GPU rendering with pixel streaming:

1. The browser displays a streamed video surface.
2. The browser sends lightweight control messages: target, yaw, pitch, zoom, time, selected event, and selected agent.
3. A remote GPU renderer keeps the 3D scene loaded and renders the requested camera state.
4. The stream returns through WebRTC or an equivalent low-latency video transport.

This is closer to Unreal Pixel Streaming, Unity Render Streaming, NVIDIA CloudXR, or a custom WebRTC renderer than to a normal static video page.

## Browser Role

The public browser should remain lightweight:

- decode video;
- show HTML overlays;
- send control packets;
- avoid local WebGL by default.

The browser may preview pre-rendered orbit media when no remote endpoint is connected.

## Renderer Role

The remote renderer owns the expensive work:

- loaded city / observatory scene;
- 360 camera orbit per global viewpoint;
- 360 camera orbit around each visible agent;
- day, night, dawn, and dusk lighting;
- event-state variants;
- media stream encoding.

The renderer can be Blender, Unreal, Unity, Omniverse, or a custom service. The web UI should not depend on the engine choice.

## Current Static Prototype

The current GitHub Pages build does not connect to a live remote GPU endpoint. It stages the control protocol and uses `assets/spatial-orbit-v0.mp4` as a fallback.

To stage a remote endpoint in the UI:

```text
index.html?renderEndpoint=wss://example-render-gateway/session
```

The page exposes the latest packet in:

```js
window.__SSO_REMOTE_RENDER_STATE__
```

It also emits:

```js
window.addEventListener("sso:remote-render-control", (event) => {
  console.log(event.detail);
});
```

## Control Packet

```json
{
  "schema": "sso.remote-render-control.v0",
  "transport": "webrtc-pixel-streaming",
  "endpoint": null,
  "endpointConfigured": false,
  "browserRole": "send-camera-controls-and-decode-video",
  "renderRole": "remote-gpu-renders-scene",
  "mode": "remote",
  "target": {
    "id": "agent-001",
    "type": "agent",
    "perspective": "overview",
    "agentId": "agent-001"
  },
  "camera": {
    "yaw": 180,
    "pitch": 4,
    "zoom": 1.18
  },
  "observatory": {
    "time": "19:40",
    "eventId": "evt-night-diffusion",
    "selectedAgentId": "agent-001"
  }
}
```

## Fallback Rule

If no remote GPU endpoint is connected, the UI maps yaw to the pre-rendered orbit video timeline. This keeps the page responsive and cheap to load while preserving the same interaction model.

Fallback is not the final 3D system. It is a public-safe placeholder for the remote render contract.
