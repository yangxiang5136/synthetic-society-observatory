# Synthetic Society Observatory

A public visual platform for testing how modular software or hardware events affect a synthetic population.

This repository is intentionally platform-first. It does not bundle private product modules, brand-specific scenarios, customer data, or project-specific assumptions by default.

## What This Is

Synthetic Society Observatory is a visual sandbox:

1. Describe a software or hardware module as structured data.
2. Inject it as an event into a synthetic society slice.
3. Observe how different agents classify, misunderstand, adopt, delay, route around, or reject the event.
4. Compare the social impact without permanently contaminating the population seed.

The current version is a local static prototype:

```text
index.html
styles.css
app.js
assets/cyberpunk-observatory-viewport.png
```

Open `index.html` in a browser to view the V0 console. The default viewport is a fixed, non-scrolling observatory interface that displays pre-rendered or vendor-rendered frames instead of running a local WebGL render loop.

- overview, observer, and first-person view modes;
- a 00:00-23:59 time scrubber;
- dawn, day, dusk, and night states linked to the timeline;
- event playback nodes that jump the timeline and switch the active module/agent;
- a compact core-status overlay for the selected agent, current time, current view, and current thought/event.

The rendered images in `assets/` are viewport assets and style references. They are not treated as live simulation proof. Future 3D work should produce frames, clips, or frame manifests through a remote/vendor render lane, then let this public UI display the returned assets.

## Module Isolation Policy

Private products and internal projects are not part of the default seed.

Default rule:

- The platform stays neutral.
- Modules enter only through explicit event manifests.
- A module can be injected, compared, paused, or removed.
- Agent memory must not assume prior knowledge of a private module unless the injected event says so.
- Public examples must use neutral sample modules.

See [docs/MODULE_ISOLATION.md](docs/MODULE_ISOLATION.md).

## Event Model

Software and hardware both enter the observatory as events.

Minimum module fields:

```json
{
  "module_id": "neutral_module_001",
  "module_type": "software | hardware | institution | service",
  "public_name": "Neutral Module",
  "purpose": "What the module is meant to do",
  "physical_properties": {
    "weight_g": 42,
    "dimensions_mm": [58, 34, 12]
  },
  "claims": [],
  "interaction_requirements": [],
  "privacy_notes": [],
  "removal_policy": "can_be_removed_without_rewriting_population_seed"
}
```

Hardware modules can be represented by weight, dimensions, purpose, battery, sensors, ergonomics, and usage constraints. Software modules can be represented by workflow, permissions, claims, cost, data access, and support burden.

## Public-Safe Boundary

This repository should not contain:

- private product names unless explicitly added for a specific run;
- real user data;
- tokens, cookies, API keys, or account identifiers;
- claims that the prototype predicts real social behavior;
- claims that staged UI equals a live runtime.

## Roadmap

- V0: visual console and module/event isolation.
- V0.2: interactive 3D viewport, camera modes, and timeline-linked lighting.
- V0.3: event playback timeline with current-event highlighting and scene diffusion states.
- V0.4: fixed one-screen console and default vendor-frame display mode with local WebGL disabled.
- V1: load module manifests from JSON.
- V2: connect synthetic population slices and event logs.
- V3: export observer slices to rendered shots.
- V4: public web deployment with shareable scenario runs.
