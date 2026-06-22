# Render Jobs

This folder describes render-worker jobs for the observatory media pipeline.

The public webpage should not run these jobs. A render worker, cloud GPU service, Hugging Face endpoint, or Windows Blender node should run them and publish the resulting media.

## V0 Target

The current webpage consumes:

- `assets/spatial-orbit-v0.mp4`
- `assets/spatial-orbit-v0-poster.jpg`
- `render-manifests/observatory-spatial-video-v0.json`

`blender_spatial_orbit_v0.py` creates the current lightweight 3D orbit proof on a Blender render worker. It is intentionally neutral and does not include private product modules.

## V1 Render Job Shape

A production render job should output:

```text
orbit_master.mp4
overview_to_observer.mp4
observer_to_first.mp4
first_to_overview.mp4
poster.jpg
camera_path.json
manifest.json
```

Optional production buffers:

```text
depth/
normal/
motion_vectors/
object_mattes/
```

The browser consumes the compressed media and manifest. It should not receive full scene geometry for public viewing unless an explicit local preview mode is enabled.
