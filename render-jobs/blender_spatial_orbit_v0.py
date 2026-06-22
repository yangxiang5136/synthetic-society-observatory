import math
import random
from pathlib import Path

import bpy


OUT_DIR = Path.home() / "Desktop" / "sso_render"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_FILE = OUT_DIR / "spatial-orbit-v0.mp4"

random.seed(42)


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def material(name, color, emission=None, strength=0.0, roughness=0.5):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = color
        bsdf.inputs["Roughness"].default_value = roughness
        if emission:
            bsdf.inputs["Emission Color"].default_value = emission
            bsdf.inputs["Emission Strength"].default_value = strength
    return mat


def add_cube(name, location, scale, mat):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if mat:
        obj.data.materials.append(mat)
    return obj


def add_cylinder(name, location, radius, depth, mat, vertices=32):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=location)
    obj = bpy.context.object
    obj.name = name
    if mat:
        obj.data.materials.append(mat)
    return obj


def add_sphere(name, location, radius, mat, segments=32):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=16, radius=radius, location=location)
    obj = bpy.context.object
    obj.name = name
    if mat:
        obj.data.materials.append(mat)
    return obj


def add_curve_line(name, points, mat, bevel=0.018):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 12
    curve.bevel_depth = bevel
    curve.bevel_resolution = 3
    spline = curve.splines.new("POLY")
    spline.points.add(len(points) - 1)
    for point, xyz in zip(spline.points, points):
        point.co = (xyz[0], xyz[1], xyz[2], 1)
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    if mat:
        curve.materials.append(mat)
    return obj


def look_at(obj, target):
    direction = target - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def set_linear_interpolation(obj):
    if not obj.animation_data or not obj.animation_data.action:
        return
    for fcurve in obj.animation_data.action.fcurves:
        for keyframe in fcurve.keyframe_points:
            keyframe.interpolation = "SINE"


clear_scene()

scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end = 216
scene.frame_set(1)
scene.render.fps = 24
scene.render.resolution_x = 1280
scene.render.resolution_y = 720
scene.render.resolution_percentage = 100
scene.render.filepath = str(OUT_FILE)

try:
    scene.render.engine = "BLENDER_EEVEE_NEXT"
except Exception:
    scene.render.engine = "BLENDER_EEVEE"

scene.eevee.taa_render_samples = 32
scene.world = bpy.data.worlds.new("SSO World") if not scene.world else scene.world
scene.world.color = (0.015, 0.018, 0.032)

scene.render.image_settings.file_format = "FFMPEG"
scene.render.ffmpeg.format = "MPEG4"
scene.render.ffmpeg.codec = "H264"
scene.render.ffmpeg.constant_rate_factor = "MEDIUM"
scene.render.ffmpeg.ffmpeg_preset = "GOOD"

mat_ground = material("soft graphite", (0.025, 0.03, 0.045, 1), roughness=0.72)
mat_road = material("wet black road", (0.006, 0.008, 0.014, 1), emission=(0.02, 0.05, 0.09, 1), strength=0.2)
mat_building = material("deep glass buildings", (0.055, 0.07, 0.09, 1), roughness=0.4)
mat_window = material("amber window glow", (0.9, 0.58, 0.18, 1), emission=(1.0, 0.5, 0.12, 1), strength=2.2)
mat_cyan = material("cyan semantic line", (0.14, 0.88, 1.0, 1), emission=(0.08, 0.8, 1.0, 1), strength=3.2)
mat_magenta = material("magenta event glow", (1.0, 0.18, 0.75, 1), emission=(1.0, 0.08, 0.62, 1), strength=5.0)
mat_violet = material("violet agent glow", (0.48, 0.32, 1.0, 1), emission=(0.44, 0.25, 1.0, 1), strength=3.4)
mat_green = material("green agent glow", (0.15, 0.95, 0.62, 1), emission=(0.05, 0.9, 0.48, 1), strength=3.0)
mat_amber = material("amber agent glow", (1.0, 0.62, 0.18, 1), emission=(1.0, 0.48, 0.08, 1), strength=3.3)
mat_blue = material("blue agent glow", (0.24, 0.45, 1.0, 1), emission=(0.1, 0.32, 1.0, 1), strength=3.0)

add_cube("observation table", (0, -0.04, 0), (18, 0.08, 18), mat_ground)
add_cube("main east west road", (0, 0.005, 0), (18, 0.035, 1.1), mat_road)
add_cube("main north south road", (0, 0.006, 0), (1.1, 0.035, 18), mat_road)
add_cube("south road", (0, 0.007, -4.2), (18, 0.035, 0.5), mat_road)
add_cube("north road", (0, 0.007, 4.2), (18, 0.035, 0.5), mat_road)

for x in [-6.8, -4.5, -2.1, 2.0, 4.5, 6.8]:
    for z in [-6.6, -2.2, 2.4, 6.5]:
        if abs(x) < 1.5 and abs(z) < 1.5:
            continue
        h = random.uniform(1.0, 4.6)
        w = random.uniform(0.75, 1.45)
        d = random.uniform(0.75, 1.45)
        building = add_cube("neutral city block", (x, h / 2, z), (w, h, d), mat_building)
        if random.random() > 0.35:
            add_cube("window strip", (x, h * 0.72, z - d / 2 - 0.012), (w * 0.68, 0.035, 0.018), mat_window)
        if random.random() > 0.55:
            add_cube("roof neon", (x, h + 0.05, z), (w * 0.82, 0.055, d * 0.82), mat_cyan)

event_core = add_sphere("event core", (0, 0.72, 0), 0.35, mat_magenta)
event_light = bpy.data.lights.new("event light", "POINT")
event_light.color = (1.0, 0.12, 0.7)
event_light.energy = 900
event_light.shadow_soft_size = 5.5
event_obj = bpy.data.objects.new("event light", event_light)
bpy.context.collection.objects.link(event_obj)
event_obj.location = (0, 2.3, 0)

for radius, zoff in [(0.8, 0.08), (1.25, 0.12), (1.75, 0.16)]:
    bpy.ops.mesh.primitive_torus_add(major_radius=radius, minor_radius=0.025, major_segments=96, minor_segments=8, location=(0, zoff, 0))
    torus = bpy.context.object
    torus.name = "event orbit ring"
    torus.data.materials.append(mat_magenta)

agent_specs = [
    ("Mara", (-3.8, 0.08, -2.8), mat_amber),
    ("Iko", (3.2, 0.08, -3.5), mat_blue),
    ("Sana", (-4.8, 0.08, 1.8), mat_magenta),
    ("Daren", (4.8, 0.08, 1.7), mat_green),
    ("Mio", (0.8, 0.08, 3.9), mat_amber),
    ("Tala", (-1.6, 0.08, 5.2), mat_violet),
    ("Oren", (5.4, 0.08, -0.8), mat_cyan),
    ("Jessa", (-5.4, 0.08, -0.9), mat_violet),
]

agent_mats = [mat_amber, mat_blue, mat_magenta, mat_green, mat_amber, mat_violet, mat_cyan, mat_violet]
for index, (name, loc, mat_agent) in enumerate(agent_specs):
    x, y, z = loc
    add_cylinder(f"{name} body", (x, 0.32, z), 0.08, 0.48, mat_agent, vertices=16)
    add_sphere(f"{name} head", (x, 0.64, z), 0.13, mat_agent, segments=16)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.25, minor_radius=0.011, location=(x, 0.08, z))
    halo = bpy.context.object
    halo.name = f"{name} semantic halo"
    halo.data.materials.append(mat_agent)
    add_curve_line(f"{name} cause link", [(0, 0.85, 0), (x, 0.72, z)], mat_agent, bevel=0.012)

for i in range(42):
    x = random.uniform(-8, 8)
    z = random.uniform(-8, 8)
    height = random.uniform(1.2, 5.5)
    add_cylinder("distant data rain", (x, height / 2 + 2.3, z), 0.008, height, mat_cyan, vertices=8)

sun = bpy.data.lights.new("large soft rim", "AREA")
sun.energy = 520
sun.size = 7
sun_obj = bpy.data.objects.new("large soft rim", sun)
bpy.context.collection.objects.link(sun_obj)
sun_obj.location = (-4, 8, -5)

fill = bpy.data.lights.new("magenta city fill", "POINT")
fill.color = (0.55, 0.16, 0.9)
fill.energy = 260
fill.shadow_soft_size = 7
fill_obj = bpy.data.objects.new("magenta city fill", fill)
bpy.context.collection.objects.link(fill_obj)
fill_obj.location = (5, 3, 4)

target = bpy.data.objects.new("camera look target", None)
bpy.context.collection.objects.link(target)
target.location = (0, 0.62, 0)

camera_data = bpy.data.cameras.new("spatial orbit camera")
camera = bpy.data.objects.new("spatial orbit camera", camera_data)
bpy.context.collection.objects.link(camera)
scene.camera = camera
camera.data.lens = 32
constraint = camera.constraints.new(type="TRACK_TO")
constraint.track_axis = "TRACK_NEGATIVE_Z"
constraint.up_axis = "UP_Y"
constraint.target = target

camera_keys = [
    (1, (8.8, 8.4, 8.8), 35, (0, 0.45, 0)),
    (72, (4.8, 3.8, 7.0), 42, (-0.4, 0.62, 0.2)),
    (144, (-2.8, 1.25, -4.2), 26, (0.2, 0.74, 0.1)),
    (216, (8.8, 8.4, 8.8), 35, (0, 0.45, 0)),
]

for frame, loc, lens, target_loc in camera_keys:
    scene.frame_set(frame)
    camera.location = loc
    camera.data.lens = lens
    target.location = target_loc
    camera.keyframe_insert(data_path="location", frame=frame)
    camera.data.keyframe_insert(data_path="lens", frame=frame)
    target.keyframe_insert(data_path="location", frame=frame)

set_linear_interpolation(camera)
set_linear_interpolation(camera.data)
set_linear_interpolation(target)

for frame, scale in [(1, 1.0), (72, 1.12), (144, 0.96), (216, 1.0)]:
    scene.frame_set(frame)
    event_core.scale = (scale, scale, scale)
    event_core.keyframe_insert(data_path="scale", frame=frame)
set_linear_interpolation(event_core)

scene.frame_set(1)
bpy.ops.render.render(animation=True)
print(f"Rendered {OUT_FILE}")
