const LOCAL_3D_ENABLED = false;
const THREE = window.THREE || null;
const queryParams = new URLSearchParams(window.location.search);
const remoteRenderEndpoint = queryParams.get("renderEndpoint") || "";

function vector3(x = 0, y = 0, z = 0) {
  return THREE ? new THREE.Vector3(x, y, z) : null;
}

const modules = [
  {
    id: "software-helper",
    type: "软件模块",
    name: "流程助手",
    title: "中性软件助手试验",
    summary: "一个工具承诺通过公共服务台进入街区。",
    payload: "用途：降低重复文书摩擦",
    location: "混合街区 / 公共服务台",
    ontology: "个体会通过时间压力、设置成本、信任和退路来分类它。",
    response: "先试用、谨慎延迟、同伴解释和离线绕行会并行出现。",
    visual: {
      color: "#f0b860",
      accent: "#b49bff"
    },
    metrics: [
      ["好奇度", 72],
      ["设置顾虑", 48],
      ["同伴验证", 64],
      ["离线退路", 38]
    ]
  },
  {
    id: "hardware-sensor",
    type: "硬件模块",
    name: "随身信号牌",
    title: "轻量设备场景试验",
    summary: "一个小型实体设备作为安全与协同辅助被引入。",
    payload: "重量：42 克 / 尺寸：58x34x12 毫米 / 用途：状态信号",
    location: "交通边缘 / 维修柜台",
    ontology: "个体会通过舒适度、电量、隐私、耐用性和可见用途来分类它。",
    response: "愿意上手的人先行动；隐私敏感的人会追问谁能看到信号。",
    visual: {
      color: "#4cc8a6",
      accent: "#6fb7e8"
    },
    metrics: [
      ["上手试用", 68],
      ["隐私顾虑", 61],
      ["设备摩擦", 44],
      ["实际用途", 76]
    ]
  },
  {
    id: "public-policy",
    type: "机构事件",
    name: "准入规则变化",
    title: "公共规则更新",
    summary: "一条本地规则改变了人们使用共享资源的方式。",
    payload: "范围：共享设施 / 影响：排队与权限变化",
    location: "社区中心 / 公告栏",
    ontology: "个体会通过公平性、不便程度、权威信任和绕行路径来分类它。",
    response: "有人遵守，有人要求解释，也有人绕开新规则。",
    visual: {
      color: "#b49bff",
      accent: "#f07a63"
    },
    metrics: [
      ["遵守倾向", 58],
      ["解释需求", 73],
      ["权威信任", 42],
      ["绕行搜索", 55]
    ]
  }
];

const agents = [
  {
    id: "agent-001",
    initials: "玛",
    name: "玛拉",
    role: "夜班操作员",
    need: "需要可靠地省时间",
    read: "只有在确实减少重复工作、且不增加设置负担时，才会把事件判断为有用。",
    question: "今晚能不能省时间？",
    action: "先试用，同时保留退路",
    color: "#f2c15f",
    position: [-3.6, -2.9]
  },
  {
    id: "agent-002",
    initials: "可",
    name: "一可",
    role: "维修爱好者",
    need: "需要亲手验证",
    read: "会把任何模块都当成可以拆看、测试、对照真实故障经验的对象。",
    question: "它会怎么出错？",
    action: "先测试边缘情况",
    color: "#77bfea",
    position: [2.9, -3.4]
  },
  {
    id: "agent-003",
    initials: "萨",
    name: "萨娜",
    role: "照护者",
    need: "需要可预期的日常节奏",
    read: "会从打断风险和协同是否更温和两个角度理解新事物。",
    question: "它会不会打乱日常？",
    action: "要求低风险试用",
    color: "#f17662",
    position: [-4.7, 1.3]
  },
  {
    id: "agent-004",
    initials: "达",
    name: "达仁",
    role: "配送骑手",
    need: "需要快速可见的用途",
    read: "会按即时路线价值、电量成本、以及别人是否已经信任来排序事件。",
    question: "下一站前它能帮上忙吗？",
    action: "只有摩擦很小时才采纳",
    color: "#4cd5ae",
    position: [4.2, 1.8]
  },
  {
    id: "agent-005",
    initials: "米",
    name: "米欧",
    role: "小店店主",
    need: "需要顾客保持平静",
    read: "会观察事件如何改变公共空间里的提问、排队和信心。",
    question: "顾客会不会因此争论？",
    action: "谨慎地向别人解释",
    color: "#eadc72",
    position: [0.6, 3.5]
  },
  {
    id: "agent-006",
    initials: "塔",
    name: "塔拉",
    role: "校园创客",
    need: "需要可改造的工具",
    read: "会寻找这个模块是否能被理解、修改，并用于小项目。",
    question: "我能改造它吗？",
    action: "先实验，再分享笔记",
    color: "#b6a2ff",
    position: [-1.2, 4.7]
  },
  {
    id: "agent-007",
    initials: "欧",
    name: "欧仁",
    role: "谨慎管理员",
    need: "需要可审计性",
    read: "会把平台承诺转化成政策、日志、责任归属和支持负担问题。",
    question: "如果坏了谁负责？",
    action: "先要求文档",
    color: "#9bb592",
    position: [4.8, -0.9]
  },
  {
    id: "agent-008",
    initials: "洁",
    name: "洁莎",
    role: "活动组织者",
    need: "需要人群协同",
    read: "会通过群体流动、社会证明、以及是否能减少大规模困惑来理解事件。",
    question: "大家能一起理解它吗？",
    action: "先用小群体试点",
    color: "#f29bb6",
    position: [-5.2, -0.8]
  }
];

const perspectives = {
  overview: {
    image: "assets/cyberpunk-observatory-viewport.png",
    alt: "中性的赛博微缩合成社会总览",
    label: "上帝视角切片",
    location: "混合街区 / 全体人群地图",
    summary: "高维三维总览",
    eventPrefix: "一个模块进入完整的三维人群地图",
    ontologyPrefix: "总览显示哪些个体群先重新理解它",
    responsePrefix: "扩散、延迟、绕行和拒绝可以同时比较"
  },
  observer: {
    image: "assets/observer-deck-view.png",
    alt: "中性的旁观甲板电影化界面视角",
    label: "旁观者切片",
    location: "旁观甲板 / 因果回放",
    summary: "第三人称因果镜头",
    eventPrefix: "旁观镜头把事件框定成可回放切片",
    ontologyPrefix: "旁观视角强调镜头、因果链接和被选中的个体",
    responsePrefix: "此模式用于公开视频表达，不等同于实时运行证明"
  },
  first: {
    image: "assets/street-event-wide.png",
    alt: "中性的街面公共通知电影化事件",
    label: "第一人称切片",
    location: "街面 / 被选中个体的视角",
    summary: "具身街面视角",
    eventPrefix: "同一个模块从街面遭遇内部出现",
    ontologyPrefix: "被选中个体会通过紧迫感、信任和本地处境看见它",
    responsePrefix: "第一人称视角揭示迟疑、注意力和社会证明"
  }
};

const spatialVideoManifest = {
  id: "observatory-spatial-video-v0",
  src: "assets/spatial-orbit-v0.mp4",
  poster: "assets/spatial-orbit-v0-poster.jpg",
  durationSeconds: 9,
  renderMode: "pre-rendered-spatial-video",
  renderSource: "vendor-or-offline-render-asset",
  views: {
    overview: {
      anchorSeconds: 0.5,
      label: "总览环绕锚点"
    },
    observer: {
      anchorSeconds: 3.0,
      label: "旁观甲板锚点"
    },
    first: {
      anchorSeconds: 6.0,
      label: "街面锚点"
    }
  }
};

const remoteRenderConfig = {
  protocol: "webrtc-pixel-streaming",
  endpoint: remoteRenderEndpoint,
  endpointConfigured: Boolean(remoteRenderEndpoint),
  browserRole: "send-camera-controls-and-decode-video",
  renderRole: "remote-gpu-renders-scene"
};

const viewTargets = [
  {
    id: "view-overview",
    type: "viewpoint",
    label: "总览 / 世界环绕",
    perspective: "overview"
  },
  {
    id: "view-observer",
    type: "viewpoint",
    label: "旁观甲板 / 因果环绕",
    perspective: "observer"
  },
  {
    id: "view-first",
    type: "viewpoint",
    label: "第一人称 / 街面环绕",
    perspective: "first"
  },
  ...agents.map((agent) => ({
    id: agent.id,
    type: "agent",
    label: `${agent.name} / 360 度聚焦`,
    agentId: agent.id
  }))
];

const dayPhases = [
  {
    id: "night",
    label: "夜晚 / 霓虹街区",
    start: 0,
    end: 300,
    sky: "#060914",
    fog: "#071023",
    ambient: 0.32,
    sun: 0.04,
    neon: 1.8,
    window: 1.55,
    agent: 1.85,
    event: 4.4
  },
  {
    id: "dawn",
    label: "黎明 / 低雾",
    start: 300,
    end: 420,
    sky: "#1a2230",
    fog: "#293247",
    ambient: 0.68,
    sun: 1.15,
    neon: 1.1,
    window: 0.8,
    agent: 1.25,
    event: 3.4
  },
  {
    id: "day",
    label: "白天 / 可读城市",
    start: 420,
    end: 1020,
    sky: "#607284",
    fog: "#70869a",
    ambient: 1.18,
    sun: 2.2,
    neon: 0.34,
    window: 0.2,
    agent: 0.72,
    event: 2.5
  },
  {
    id: "dusk",
    label: "黄昏 / 语义辉光",
    start: 1020,
    end: 1140,
    sky: "#15172c",
    fog: "#2a2340",
    ambient: 0.72,
    sun: 0.95,
    neon: 1.35,
    window: 1.1,
    agent: 1.55,
    event: 4.0
  },
  {
    id: "night",
    label: "夜晚 / 霓虹街区",
    start: 1140,
    end: 1440,
    sky: "#060914",
    fog: "#071023",
    ambient: 0.32,
    sun: 0.04,
    neon: 1.8,
    window: 1.55,
    agent: 1.85,
    event: 4.4
  }
];

const timelineEvents = [
  {
    id: "evt-dawn-exposure",
    time: 390,
    moduleId: "software-helper",
    agentId: "agent-005",
    title: "清晨安静暴露",
    summary: "街区进入高活动前，一条服务台提示先被少数人看见。",
    color: "#6fb7e8",
    intensity: 0.56,
    duration: 210,
    focusAgents: ["agent-005", "agent-001", "agent-007"]
  },
  {
    id: "evt-day-trial",
    time: 720,
    moduleId: "hardware-sensor",
    agentId: "agent-002",
    title: "白天上手试用",
    summary: "一个实体模块在白天被查看，舒适度、隐私和用途变得可见。",
    color: "#4cc8a6",
    intensity: 0.68,
    duration: 260,
    focusAgents: ["agent-002", "agent-004", "agent-006"]
  },
  {
    id: "evt-dusk-retype",
    time: 1080,
    moduleId: "public-policy",
    agentId: "agent-007",
    title: "语义重分类峰值",
    summary: "一条中性规则更新被不同个体重新分类为公平、负担或绕行风险。",
    color: "#b49bff",
    intensity: 0.88,
    duration: 170,
    focusAgents: ["agent-007", "agent-003", "agent-008"]
  },
  {
    id: "evt-night-diffusion",
    time: 1180,
    moduleId: "software-helper",
    agentId: "agent-001",
    title: "夜间扩散检查",
    summary: "同一事件在时间压力下被测试，退路和同伴信任变得更重要。",
    color: "#f0b860",
    intensity: 1,
    duration: 190,
    focusAgents: ["agent-001", "agent-004", "agent-005", "agent-006"]
  },
  {
    id: "evt-late-workaround",
    time: 1320,
    moduleId: "hardware-sensor",
    agentId: "agent-004",
    title: "深夜绕行路径",
    summary: "有些个体接受模块为有用工具，另一些则绕行或等待更清楚的证明。",
    color: "#f07a63",
    intensity: 0.74,
    duration: 160,
    focusAgents: ["agent-004", "agent-003", "agent-008"]
  }
];

const timePresets = [
  { id: "preset-dawn", label: "黎明", time: 390, detail: "低雾" },
  { id: "preset-day", label: "白天", time: 720, detail: "可读城市" },
  { id: "preset-dusk", label: "黄昏", time: 1080, detail: "语义辉光" },
  { id: "preset-night", label: "夜晚", time: 1180, detail: "霓虹街区" }
];

let activeModule = modules[0];
let activeAgent = agents[0];
let activePerspective = "overview";
let activeTimelineEvent = timelineEvents[3];
let activeMinutes = 1180;
let isPlaying = false;
let timer = null;
let pendingVideoAnchor = spatialVideoManifest.views.overview.anchorSeconds;
let activeViewTargetId = "view-overview";
let autoOrbitEnabled = false;
let spatialMediaActive = false;
let renderTransportMode = "fallback";
const viewControlState = new Map();

const moduleRack = document.querySelector("#moduleRack");
const agentRail = document.querySelector("#agentRail");
const impactRows = document.querySelector("#impactRows");
const eventStream = document.querySelector("#eventStream");
const playButton = document.querySelector("#playButton");
const clockLabel = document.querySelector("#clockLabel");
const dayPhaseLabel = document.querySelector("#dayPhaseLabel");
const timeScrubber = document.querySelector("#timeScrubber");
const stageVideo = document.querySelector("#stageVideo");
const stageImage = document.querySelector("#stageImage");
const worldStage = document.querySelector(".world-stage");
const perspectiveSummary = document.querySelector("#perspectiveSummary");
const viewModeLabel = document.querySelector("#viewModeLabel");
const canvas = document.querySelector("#worldCanvas");
const timelineTrack = document.querySelector("#timelineTrack");
const timePresetsContainer = document.querySelector("#timePresets");
const currentEventLabel = document.querySelector("#currentEventLabel");
const activeEventTime = document.querySelector("#activeEventTime");
const activeEventTitle = document.querySelector("#activeEventTitle");
const activeEventSummary = document.querySelector("#activeEventSummary");
const coreAgentName = document.querySelector("#coreAgentName");
const coreAgentRole = document.querySelector("#coreAgentRole");
const coreTime = document.querySelector("#coreTime");
const corePhase = document.querySelector("#corePhase");
const coreView = document.querySelector("#coreView");
const coreRenderMode = document.querySelector("#coreRenderMode");
const coreThought = document.querySelector("#coreThought");
const coreEvent = document.querySelector("#coreEvent");
const viewTargetSelect = document.querySelector("#viewTargetSelect");
const yawControl = document.querySelector("#yawControl");
const pitchControl = document.querySelector("#pitchControl");
const zoomControl = document.querySelector("#zoomControl");
const yawValue = document.querySelector("#yawValue");
const pitchValue = document.querySelector("#pitchValue");
const zoomValue = document.querySelector("#zoomValue");
const renderModeBadge = document.querySelector("#renderModeBadge");
const renderStatusLine = document.querySelector("#renderStatusLine");
const autoOrbitButton = document.querySelector("#autoOrbitButton");
const resetViewButton = document.querySelector("#resetViewButton");
const remoteModeButton = document.querySelector("#remoteModeButton");

const world = {
  ready: false,
  renderer: null,
  scene: null,
  camera: null,
  clock: THREE ? new THREE.Clock() : null,
  cameraLookAt: vector3(0, 0.4, 0),
  targetPosition: vector3(8.8, 10.5, 8.2),
  targetLookAt: vector3(0, 0.2, 0),
  groundMaterial: null,
  roadMaterial: null,
  buildingMaterial: null,
  windowMaterial: null,
  neonMaterial: null,
  eventMaterial: null,
  eventBeamMaterial: null,
  eventLight: null,
  sunLight: null,
  hemisphereLight: null,
  eventGroup: null,
  rings: [],
  agentObjects: new Map(),
  connectionLines: new Map()
};

function renderModules() {
  moduleRack.innerHTML = "";
  modules.forEach((module) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "module-card";
    button.dataset.module = module.id;
    button.innerHTML = `
      <span>${module.type}</span>
      <strong>${module.name}</strong>
      <small>${module.payload}</small>
    `;
    button.addEventListener("click", () => selectModule(module.id));
    moduleRack.appendChild(button);
  });
}

function renderAgents() {
  agentRail.innerHTML = "";
  agents.forEach((agent) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "agent-button";
    button.dataset.agent = agent.id;
    button.style.setProperty("--agent-color", agent.color);
    button.innerHTML = `
      <span class="agent-dot" aria-hidden="true">${agent.initials}</span>
      <span>
        <strong>${agent.name}</strong>
        <span>${agent.role}</span>
      </span>
    `;
    button.addEventListener("click", () => selectAgent(agent.id));
    agentRail.appendChild(button);
  });
}

function renderImpactRows() {
  impactRows.innerHTML = "";
  activeModule.metrics.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "impact-row";
    row.innerHTML = `
      <span>${label}</span>
      <div class="impact-track" aria-hidden="true">
        <div class="impact-fill" style="--value: ${value}%"></div>
      </div>
      <strong>${value}%</strong>
    `;
    impactRows.appendChild(row);
  });
}

function renderTimeline() {
  timelineTrack.innerHTML = "";
  if (eventStream) {
    eventStream.innerHTML = "";
  }
  timelineEvents.forEach((event) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "timeline-event";
    button.dataset.event = event.id;
    button.dataset.time = formatClock(event.time);
    button.style.setProperty("--event-position", `${(event.time / 1439) * 100}%`);
    button.style.setProperty("--event-color", event.color);
    button.setAttribute("aria-label", `${formatClock(event.time)} ${event.title}`);
    button.addEventListener("click", () => jumpToTimelineEvent(event.id));
    timelineTrack.appendChild(button);

    if (eventStream) {
      const streamButton = document.createElement("button");
      streamButton.type = "button";
      streamButton.className = "event-card";
      streamButton.dataset.event = event.id;
      streamButton.style.setProperty("--event-color", event.color);
      streamButton.innerHTML = `
        <span>${formatClock(event.time)}</span>
        <strong>${event.title}</strong>
        <small>${event.summary}</small>
      `;
      streamButton.addEventListener("click", () => jumpToTimelineEvent(event.id));
      eventStream.appendChild(streamButton);
    }
  });

  timePresetsContainer.innerHTML = "";
  timePresets.forEach((preset) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "time-preset";
    button.dataset.preset = preset.id;
    button.innerHTML = `
      <strong>${preset.label}</strong>
      <span>${formatClock(preset.time)} / ${preset.detail}</span>
    `;
    button.addEventListener("click", () => jumpToTime(preset.time));
    timePresetsContainer.appendChild(button);
  });
}

function renderViewTargets() {
  if (!viewTargetSelect) return;
  viewTargetSelect.innerHTML = "";
  viewTargets.forEach((target) => {
    const option = document.createElement("option");
    option.value = target.id;
    option.textContent = target.label;
    viewTargetSelect.appendChild(option);
  });
  viewTargetSelect.value = activeViewTargetId;
}

function getViewTarget(targetId = activeViewTargetId) {
  return viewTargets.find((target) => target.id === targetId) || viewTargets[0];
}

function getViewState(targetId = activeViewTargetId) {
  if (!viewControlState.has(targetId)) {
    viewControlState.set(targetId, {
      yaw: 0,
      pitch: targetId.startsWith("agent-") ? 4 : 12,
      zoom: targetId.startsWith("agent-") ? 1.18 : 1
    });
  }
  return viewControlState.get(targetId);
}

function selectViewTarget(targetId) {
  const target = getViewTarget(targetId);
  activeViewTargetId = target.id;
  spatialMediaActive = true;
  if (viewTargetSelect && viewTargetSelect.value !== target.id) {
    viewTargetSelect.value = target.id;
  }
  if (target.type === "agent" && target.agentId) {
    selectAgent(target.agentId);
  }
  if (target.type === "viewpoint" && target.perspective) {
    selectPerspective(target.perspective);
  }
  syncViewControls({ seekVideo: true });
}

function shouldShowSpatialMedia() {
  return spatialMediaActive || autoOrbitEnabled || renderTransportMode === "remote";
}

function syncStageMotionState() {
  if (!worldStage) return;
  const showSpatialMedia = shouldShowSpatialMedia();
  worldStage.dataset.motion = showSpatialMedia ? "orbit" : "still";
  if (!stageVideo) return;
  if (showSpatialMedia && autoOrbitEnabled && renderTransportMode !== "remote") {
    stageVideo.play().catch(() => {
      worldStage.dataset.videoAutoplay = "blocked";
    });
  } else {
    stageVideo.pause();
  }
}

function setAutoOrbit(enabled) {
  autoOrbitEnabled = Boolean(enabled);
  if (autoOrbitEnabled) {
    spatialMediaActive = true;
  }
  autoOrbitButton?.classList.toggle("is-active", autoOrbitEnabled);
  syncStageMotionState();
}

function setRenderTransportMode(mode) {
  renderTransportMode = mode === "remote" ? "remote" : "fallback";
  if (renderTransportMode === "remote") {
    spatialMediaActive = true;
  }
  remoteModeButton?.classList.toggle("is-active", renderTransportMode === "remote");
  if (remoteModeButton) {
    remoteModeButton.textContent = renderTransportMode === "remote" ? "远端已准备" : "远端渲染";
  }
  syncViewControls({ seekVideo: renderTransportMode !== "remote" });
}

function updateControlLabels(state = getViewState()) {
  if (yawValue) yawValue.textContent = `${Math.round(state.yaw)}°`;
  if (pitchValue) pitchValue.textContent = `${Math.round(state.pitch)}°`;
  if (zoomValue) zoomValue.textContent = `${Number(state.zoom).toFixed(2)} 倍`;
  if (yawControl) yawControl.value = String(Math.round(state.yaw));
  if (pitchControl) pitchControl.value = String(Math.round(state.pitch));
  if (zoomControl) zoomControl.value = String(Number(state.zoom).toFixed(2));
}

function seekSpatialVideoByYaw(yaw) {
  if (!stageVideo) return;
  const duration = Number.isFinite(stageVideo.duration) && stageVideo.duration > 0
    ? stageVideo.duration
    : spatialVideoManifest.durationSeconds;
  const normalizedYaw = ((yaw % 360) + 360) % 360;
  const targetTime = (normalizedYaw / 360) * duration;
  try {
    stageVideo.currentTime = Math.max(0, Math.min(duration - 0.05, targetTime));
  } catch (error) {
    pendingVideoAnchor = targetTime;
  }
}

function buildRemoteRenderPayload() {
  const target = getViewTarget();
  const state = getViewState();
  return {
    schema: "sso.remote-render-control.v0",
    transport: remoteRenderConfig.protocol,
    endpoint: remoteRenderConfig.endpoint || null,
    endpointConfigured: remoteRenderConfig.endpointConfigured,
    browserRole: remoteRenderConfig.browserRole,
    renderRole: remoteRenderConfig.renderRole,
    mode: renderTransportMode,
    target: {
      id: target.id,
      type: target.type,
      perspective: target.perspective || activePerspective,
      agentId: target.agentId || activeAgent.id
    },
    camera: {
      yaw: Number(state.yaw.toFixed(2)),
      pitch: Number(state.pitch.toFixed(2)),
      zoom: Number(state.zoom.toFixed(2))
    },
    observatory: {
      time: formatClock(activeMinutes),
      eventId: activeTimelineEvent?.id,
      selectedAgentId: activeAgent.id
    }
  };
}

function syncViewControls(options = {}) {
  const state = getViewState();
  updateControlLabels(state);
  worldStage.style.setProperty("--view-zoom", String(state.zoom));
  worldStage.style.setProperty("--view-pitch", String(state.pitch));
  worldStage.style.setProperty("--view-yaw", String(state.yaw));
  worldStage.dataset.renderTransport = renderTransportMode;
  worldStage.dataset.viewTarget = activeViewTargetId;
  if (options.seekVideo && renderTransportMode !== "remote") {
    spatialMediaActive = true;
    seekSpatialVideoByYaw(state.yaw);
  }
  syncStageMotionState();

  const payload = buildRemoteRenderPayload();
  window.__SSO_REMOTE_RENDER_STATE__ = payload;
  window.dispatchEvent(new CustomEvent("sso:remote-render-control", { detail: payload }));
  if (renderModeBadge) {
    renderModeBadge.textContent = renderTransportMode === "remote" ? "远端已准备" : "媒体回退";
  }
  if (renderStatusLine) {
    if (renderTransportMode === "remote" && remoteRenderConfig.endpointConfigured) {
      renderStatusLine.textContent = "远端渲染控制包已准备，将发送到配置好的视频流端点。";
    } else if (renderTransportMode === "remote") {
      renderStatusLine.textContent = "远端渲染控制包已准备；配置渲染端点后即可连接视频流服务。";
    } else if (!shouldShowSpatialMedia()) {
      renderStatusLine.textContent = "默认显示总览沙盘静帧；拖动视角或开启自动环绕后，浏览器只解码预渲染 360 度媒体。";
    } else {
      renderStatusLine.textContent = "当前使用预渲染 360 度环绕媒体，浏览器只解码视频，不执行本地三维渲染。";
    }
  }
  if (coreRenderMode) {
    coreRenderMode.textContent = renderTransportMode === "remote"
      ? "远端渲染已准备 / 不启用本地三维渲染"
      : shouldShowSpatialMedia()
        ? "360 度媒体回退 / 不启用本地三维渲染"
        : "沙盘静帧 / 可切换 360 度媒体";
  }
}

function updateViewState(patch, options = {}) {
  const state = getViewState();
  Object.assign(state, patch);
  if ("yaw" in patch && options.userInput) {
    setAutoOrbit(false);
  }
  syncViewControls({ seekVideo: true });
}

function getTimelineEventByTime(minutes) {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  let selected = timelineEvents[timelineEvents.length - 1];
  timelineEvents.forEach((event) => {
    if (normalized >= event.time) {
      selected = event;
    }
  });
  return selected;
}

function setActiveTimelineEvent(event) {
  if (!event) return;
  activeTimelineEvent = event;
  activeModule = modules.find((module) => module.id === event.moduleId) || activeModule;
  activeAgent = agents.find((agent) => agent.id === event.agentId) || activeAgent;
  syncModule();
  syncAgent();
  syncSceneModule();
  syncTimeline();
  applyTimelineSceneState();
  setCameraTarget();
}

function jumpToTimelineEvent(eventId) {
  const event = timelineEvents.find((item) => item.id === eventId);
  if (!event) return;
  timeScrubber.value = String(event.time);
  activeMinutes = event.time;
  setActiveTimelineEvent(event);
  updateClock();
}

function jumpToTime(minutes) {
  timeScrubber.value = String(minutes);
  activeMinutes = minutes;
  updateClock();
}

function syncTimeline() {
  if (!activeTimelineEvent) return;
  currentEventLabel.textContent = `当前事件：${activeTimelineEvent.title}`;
  activeEventTime.textContent = formatClock(activeTimelineEvent.time);
  activeEventTitle.textContent = activeTimelineEvent.title;
  activeEventSummary.textContent = activeTimelineEvent.summary;

  document.querySelectorAll(".timeline-event").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.event === activeTimelineEvent.id);
  });

  document.querySelectorAll(".event-card").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.event === activeTimelineEvent.id);
  });

  const activePhase = getDayPhase(activeMinutes).id;
  document.querySelectorAll(".time-preset").forEach((button) => {
    const preset = timePresets.find((item) => item.id === button.dataset.preset);
    button.classList.toggle("is-active", preset && getDayPhase(preset.time).id === activePhase);
  });
  updateCoreStatus();
}

function selectModule(moduleId) {
  activeModule = modules.find((module) => module.id === moduleId) || modules[0];
  syncModule();
  syncSceneModule();
}

function selectAgent(agentId) {
  activeAgent = agents.find((agent) => agent.id === agentId) || agents[0];
  syncAgent();
  setCameraTarget();
}

function syncModule() {
  const scenarioTitle = document.querySelector("#activeScenarioTitle");
  if (scenarioTitle) {
    scenarioTitle.textContent = activeModule.title;
  }
  const perspective = perspectives[activePerspective];
  document.querySelector("#activeLocation").textContent = perspective.location;
  document.querySelector("#activeModuleType").textContent = activeModule.type;
  document.querySelector("#activeModuleName").textContent = activeModule.name;
  document.querySelector("#activeModulePayload").textContent = activeModule.payload;
  document.querySelector("#eventSummary").textContent = perspective.eventPrefix;
  document.querySelector("#ontologySummary").textContent = perspective.ontologyPrefix;
  document.querySelector("#responseSummary").textContent = perspective.responsePrefix;
  renderImpactRows();

  document.querySelectorAll(".module-card").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.module === activeModule.id);
  });
  updateCoreStatus();
}

function selectPerspective(viewId) {
  activePerspective = perspectives[viewId] ? viewId : "overview";
  activeViewTargetId = `view-${activePerspective}`;
  if (viewTargetSelect) {
    viewTargetSelect.value = activeViewTargetId;
  }
  const perspective = perspectives[activePerspective];
  stageImage.src = perspective.image;
  stageImage.alt = perspective.alt;
  worldStage.dataset.perspective = activePerspective;
  perspectiveSummary.textContent = perspective.summary;
  viewModeLabel.textContent = perspective.label;
  document.querySelectorAll("[data-view]").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.view === activePerspective);
  });
  syncModule();
  updateCoreStatus();
  syncSpatialVideoView(activePerspective, { play: autoOrbitEnabled });
  syncViewControls({ seekVideo: false });
  syncAgentFocus();
  setCameraTarget();
}

function syncAgent() {
  document.querySelector("#selectedAgentName").textContent = activeAgent.name;
  document.querySelector("#selectedAgentRole").textContent = activeAgent.role;
  document.querySelector("#selectedAgentNeed").textContent = activeAgent.need;
  document.querySelector("#selectedAgentRead").textContent = activeAgent.read;
  document.querySelector("#agentQuestion").textContent = activeAgent.question;
  document.querySelector("#agentAction").textContent = activeAgent.action;

  document.querySelectorAll(".agent-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.agent === activeAgent.id);
  });

  syncAgentFocus();
  updateCoreStatus();
}

function formatClock(minutes) {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const hours = String(Math.floor(normalized / 60)).padStart(2, "0");
  const mins = String(normalized % 60).padStart(2, "0");
  return `${hours}:${mins}`;
}

function getDayPhase(minutes) {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  return dayPhases.find((phase) => normalized >= phase.start && normalized < phase.end) || dayPhases[0];
}

function updateClock() {
  activeMinutes = Number(timeScrubber.value);
  const phase = getDayPhase(activeMinutes);
  const event = getTimelineEventByTime(activeMinutes);
  if (event && event.id !== activeTimelineEvent?.id) {
    setActiveTimelineEvent(event);
  }
  clockLabel.textContent = formatClock(activeMinutes);
  dayPhaseLabel.textContent = phase.label;
  worldStage.dataset.timePhase = phase.id;
  document.body.dataset.timePhase = phase.id;
  applySceneTime(phase, activeMinutes);
  applyTimelineSceneState();
  syncTimeline();
  updateCoreStatus();
}

function togglePlay() {
  isPlaying = !isPlaying;
  playButton.textContent = isPlaying ? "暂停时间线" : "播放时间线";

  if (isPlaying) {
    timer = window.setInterval(() => {
      const next = (Number(timeScrubber.value) + 10) % 1440;
      timeScrubber.value = String(next);
      updateClock();
    }, 1000);
  } else {
    window.clearInterval(timer);
  }
}

function updateCoreStatus() {
  const phase = getDayPhase(activeMinutes);
  const perspective = perspectives[activePerspective];
  if (coreAgentName) coreAgentName.textContent = activeAgent.name;
  if (coreAgentRole) coreAgentRole.textContent = activeAgent.role;
  if (coreTime) coreTime.textContent = formatClock(activeMinutes);
  if (corePhase) corePhase.textContent = phase.label;
  if (coreView) coreView.textContent = perspective?.label || activePerspective;
  if (coreRenderMode) {
    coreRenderMode.textContent = renderTransportMode === "remote"
      ? "远端渲染已准备 / 不启用本地三维渲染"
      : shouldShowSpatialMedia()
        ? "360 度媒体回退 / 不启用本地三维渲染"
        : "沙盘静帧 / 可切换 360 度媒体";
  }
  if (coreThought) coreThought.textContent = activeAgent.question;
  if (coreEvent) {
    coreEvent.textContent = activeTimelineEvent
      ? `${formatClock(activeTimelineEvent.time)} / ${activeTimelineEvent.title}`
      : activeModule.summary;
  }
}

function applySpatialVideoAnchor(anchorSeconds, options = {}) {
  if (!stageVideo || !Number.isFinite(anchorSeconds)) return;
  pendingVideoAnchor = anchorSeconds;
  if (stageVideo.readyState < 1) return;
  const duration = Number.isFinite(stageVideo.duration) && stageVideo.duration > 0
    ? stageVideo.duration
    : spatialVideoManifest.durationSeconds;
  const safeAnchor = Math.max(0, Math.min(duration - 0.1, anchorSeconds));
  try {
    stageVideo.currentTime = safeAnchor;
  } catch (error) {
    // Some browsers reject early media seeks before metadata is fully usable.
  }
  stageVideo.playbackRate = 1;
  if (options.play) {
    stageVideo.play().catch(() => {
      worldStage.dataset.videoAutoplay = "blocked";
    });
  } else {
    stageVideo.pause();
  }
}

function syncSpatialVideoView(viewId, options = {}) {
  const view = spatialVideoManifest.views[viewId] || spatialVideoManifest.views.overview;
  worldStage.dataset.videoAnchor = view.label;
  applySpatialVideoAnchor(view.anchorSeconds, options);
  syncStageMotionState();
}

function createMaterial(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.62,
    metalness: options.metalness ?? 0.18,
    emissive: options.emissive ?? "#000000",
    emissiveIntensity: options.emissiveIntensity ?? 0,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1
  });
}

function createGlowMaterial(color, options = {}) {
  return new THREE.MeshBasicMaterial({
    color,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1,
    blending: options.blending ?? THREE.NormalBlending,
    depthWrite: options.depthWrite ?? true,
    toneMapped: false
  });
}

function createLine(points, color, opacity = 0.44) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    depthTest: false
  });
  return new THREE.Line(geometry, material);
}

function initScene() {
  if (!LOCAL_3D_ENABLED || !THREE || !canvas) return;

  world.renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance"
  });
  world.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  if ("outputColorSpace" in world.renderer && THREE.SRGBColorSpace) {
    world.renderer.outputColorSpace = THREE.SRGBColorSpace;
  }
  if ("outputEncoding" in world.renderer && THREE.sRGBEncoding) {
    world.renderer.outputEncoding = THREE.sRGBEncoding;
  }
  if (THREE.ACESFilmicToneMapping) {
    world.renderer.toneMapping = THREE.ACESFilmicToneMapping;
  }
  world.renderer.toneMappingExposure = 1.05;

  world.scene = new THREE.Scene();
  world.scene.background = new THREE.Color("#060914");
  world.scene.fog = new THREE.FogExp2("#071023", 0.042);

  world.camera = new THREE.PerspectiveCamera(46, 1, 0.1, 90);
  world.camera.position.copy(world.targetPosition);
  world.camera.lookAt(world.cameraLookAt);

  world.hemisphereLight = new THREE.HemisphereLight("#b6cff0", "#16110f", 0.34);
  world.scene.add(world.hemisphereLight);

  world.sunLight = new THREE.DirectionalLight("#fff1cf", 1.2);
  world.sunLight.position.set(4, 7, 2);
  world.scene.add(world.sunLight);

  const city = new THREE.Group();
  city.name = "synthetic-city-model";
  world.scene.add(city);

  world.groundMaterial = createMaterial("#141920", { roughness: 0.78, metalness: 0.25 });
  world.roadMaterial = createMaterial("#0b0f17", {
    roughness: 0.46,
    metalness: 0.4,
    emissive: "#152838",
    emissiveIntensity: 0.55
  });
  world.buildingMaterial = createMaterial("#1a222c", { roughness: 0.62, metalness: 0.28 });
  world.windowMaterial = createGlowMaterial("#f0b860", {
    transparent: true,
    opacity: 0.78,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  world.neonMaterial = createGlowMaterial("#4cc8a6", {
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  world.eventMaterial = createGlowMaterial(activeModule.visual.color, {
    transparent: true,
    opacity: 1,
    blending: THREE.NormalBlending,
    depthWrite: false
  });
  world.eventBeamMaterial = createGlowMaterial(activeModule.visual.color, {
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), world.groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  city.add(ground);

  addRoads(city);
  addBuildings(city);
  addEventCore(city);
  addAgents(city);

  setCameraTarget();
  window.addEventListener("resize", resizeRenderer);
  world.ready = true;
  updateClock();
  syncSceneModule();
  syncAgentFocus();
  resizeRenderer();
  worldStage.classList.add("is-3d-ready");
  window.__SSO3D_DEBUG__ = {
    get ready() {
      return world.ready;
    },
    get activePerspective() {
      return activePerspective;
    },
    get activeTime() {
      return formatClock(activeMinutes);
    },
    get activeEvent() {
      return activeTimelineEvent?.id;
    },
    get objectCount() {
      return world.scene?.children.length ?? 0;
    }
  };
  animate();
}

function initVendorFrameMode() {
  world.ready = false;
  if (canvas) canvas.setAttribute("hidden", "");
  worldStage.classList.remove("is-3d-ready");
  worldStage.classList.add("is-vendor-frame");
  worldStage.dataset.renderMode = spatialVideoManifest.renderMode;
  initSpatialVideo();
  updateCoreStatus();
  window.__SSO3D_DEBUG__ = {
    get ready() {
      return false;
    },
    get renderMode() {
      return spatialVideoManifest.renderMode;
    },
    get localRenderLoop() {
      return false;
    },
    get usesLocalWebGL() {
      return false;
    },
    get mediaMode() {
      return "video-decode-only";
    },
    get videoSrc() {
      return spatialVideoManifest.src;
    },
    get activePerspective() {
      return activePerspective;
    },
    get activeTime() {
      return formatClock(activeMinutes);
    },
    get activeEvent() {
      return activeTimelineEvent?.id;
    }
  };
}

function initSpatialVideo() {
  if (!stageVideo) return;
  stageVideo.muted = true;
  stageVideo.loop = true;
  stageVideo.playsInline = true;
  stageVideo.addEventListener("timeupdate", () => {
    if (!autoOrbitEnabled || renderTransportMode === "remote") return;
    const duration = Number.isFinite(stageVideo.duration) && stageVideo.duration > 0
      ? stageVideo.duration
      : spatialVideoManifest.durationSeconds;
    const state = getViewState();
    state.yaw = ((stageVideo.currentTime / duration) * 360) % 360;
    syncViewControls({ seekVideo: false });
  });
  stageVideo.addEventListener("loadedmetadata", () => {
    worldStage.classList.add("is-video-ready");
    applySpatialVideoAnchor(pendingVideoAnchor, { play: autoOrbitEnabled });
  }, { once: true });
  stageVideo.addEventListener("canplay", () => {
    worldStage.classList.add("is-video-ready");
  });
  stageVideo.addEventListener("error", () => {
    worldStage.classList.remove("is-video-ready");
    worldStage.dataset.videoError = "true";
  });
  stageVideo.pause();
  syncStageMotionState();
}

function addRoads(city) {
  const roadSpecs = [
    [0, 0, 18, 1.05],
    [0, -3.8, 18, 0.58],
    [0, 3.7, 18, 0.58],
    [-3.4, 0, 0.64, 18],
    [3.6, 0, 0.64, 18]
  ];

  roadSpecs.forEach(([x, z, width, depth]) => {
    const road = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), world.roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.set(x, 0.015, z);
    city.add(road);
  });

  const gridMaterial = new THREE.LineBasicMaterial({
    color: "#35506b",
    transparent: true,
    opacity: 0.28
  });

  for (let i = -8; i <= 8; i += 2) {
    const lineX = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i, 0.025, -8.5),
        new THREE.Vector3(i, 0.025, 8.5)
      ]),
      gridMaterial
    );
    const lineZ = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-8.5, 0.025, i),
        new THREE.Vector3(8.5, 0.025, i)
      ]),
      gridMaterial
    );
    city.add(lineX, lineZ);
  }
}

function addBuildings(city) {
  const positions = [
    [-6.6, -6.3, 1.25, 1.35, 2.2],
    [-4.7, -5.8, 1.4, 1.1, 1.4],
    [-1.8, -5.9, 1.8, 1.2, 2.8],
    [1.7, -6.1, 1.3, 1.4, 1.9],
    [5.8, -6.0, 1.8, 1.25, 2.7],
    [-6.2, -2.1, 1.4, 1.8, 3.2],
    [-1.9, -2.1, 1.5, 1.3, 1.5],
    [2.2, -2.2, 1.7, 1.4, 3.5],
    [6.2, -2.0, 1.4, 1.7, 2.4],
    [-6.4, 2.2, 1.7, 1.3, 2.9],
    [-1.8, 2.2, 1.3, 1.5, 2.1],
    [2.4, 2.2, 1.55, 1.5, 3.0],
    [6.1, 2.1, 1.7, 1.3, 1.8],
    [-5.7, 6.1, 1.7, 1.3, 2.1],
    [-1.8, 6.1, 1.4, 1.35, 2.6],
    [2.2, 6.2, 1.5, 1.45, 2.0],
    [6.1, 5.9, 1.8, 1.2, 3.4]
  ];

  positions.forEach(([x, z, width, depth, height], index) => {
    const building = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), world.buildingMaterial.clone());
    building.position.set(x, height / 2, z);
    building.material.color.offsetHSL(0, 0, (index % 4) * 0.018);
    city.add(building);

    const cap = new THREE.Mesh(new THREE.BoxGeometry(width * 0.72, 0.08, depth * 0.72), world.neonMaterial);
    cap.position.set(x, height + 0.045, z);
    city.add(cap);

    for (let row = 0; row < Math.max(1, Math.floor(height * 1.5)); row += 1) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(width * 0.62, 0.035, 0.025), world.windowMaterial);
      strip.position.set(x, 0.42 + row * 0.38, z - depth / 2 - 0.015);
      city.add(strip);
    }
  });
}

function addEventCore(city) {
  world.eventGroup = new THREE.Group();
  world.eventGroup.position.set(0, 0.05, 0);
  city.add(world.eventGroup);

  const platform = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.04, 0.08, 48), world.roadMaterial);
  platform.position.y = 0.04;
  world.eventGroup.add(platform);

  const core = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 16), world.eventMaterial);
  core.position.y = 0.62;
  world.eventGroup.add(core);

  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.28, 3.2, 32, 1, true), world.eventBeamMaterial);
  beam.position.y = 1.66;
  world.eventGroup.add(beam);

  for (let i = 0; i < 3; i += 1) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.54 + i * 0.32, 0.018, 12, 72), world.eventMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.08 + i * 0.035;
    ring.userData.speed = 0.26 + i * 0.14;
    world.rings.push(ring);
    world.eventGroup.add(ring);
  }

  world.eventLight = new THREE.PointLight(activeModule.visual.color, 4.2, 12, 1.4);
  world.eventLight.position.set(0, 2.2, 0);
  city.add(world.eventLight);
}

function addAgents(city) {
  const center = new THREE.Vector3(0, 1.18, 0);

  agents.forEach((agent) => {
    const color = new THREE.Color(agent.color);
    const material = createGlowMaterial(agent.color, {
      transparent: true,
      opacity: 0.92,
      depthWrite: false
    });
    const group = new THREE.Group();
    group.name = agent.id;
    group.position.set(agent.position[0], 0, agent.position[1]);

    const body = new THREE.Group();
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.44, 14), material);
    torso.position.y = 0.2;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 10), material);
    head.position.y = 0.48;
    body.add(torso, head);
    body.position.y = 0.42;
    group.add(body);

    const haloMaterial = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.52,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.012, 8, 40), haloMaterial);
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 0.045;
    group.add(halo);

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5, 8), material);
    stem.position.y = 0.22;
    group.add(stem);

    const light = new THREE.PointLight(agent.color, 0.55, 2.7, 1.3);
    light.position.y = 0.65;
    group.add(light);

    city.add(group);

    const agentPoint = new THREE.Vector3(agent.position[0], 0.92, agent.position[1]);
    const line = createLine([center, agentPoint], agent.color, 0.42);
    city.add(line);

    world.agentObjects.set(agent.id, { group, body, halo, light, material, haloMaterial });
    world.connectionLines.set(agent.id, line);
  });
}

function getAgentPosition(agent = activeAgent) {
  return new THREE.Vector3(agent.position[0], 0, agent.position[1]);
}

function resolveCameraPreset() {
  const agentPosition = getAgentPosition(activeAgent);
  if (activePerspective === "first") {
    const awayFromCenter = agentPosition.clone().normalize();
    if (awayFromCenter.lengthSq() < 0.01) {
      awayFromCenter.set(0, 0, 1);
    }
    return {
      fov: 64,
      position: new THREE.Vector3(agentPosition.x, 1.22, agentPosition.z).add(awayFromCenter.multiplyScalar(0.78)),
      target: new THREE.Vector3(0, 0.66, 0)
    };
  }

  if (activePerspective === "observer") {
    return {
      fov: 50,
      position: new THREE.Vector3(6.8, 4.7, 7.2),
      target: new THREE.Vector3(agentPosition.x * 0.18, 0.55, agentPosition.z * 0.18)
    };
  }

  return {
    fov: 45,
    position: new THREE.Vector3(8.9, 10.4, 8.4),
    target: new THREE.Vector3(0, 0.18, 0)
  };
}

function setCameraTarget() {
  if (!world.camera) return;
  const preset = resolveCameraPreset();
  world.targetPosition.copy(preset.position);
  world.targetLookAt.copy(preset.target);
  world.camera.fov = preset.fov;
  world.camera.updateProjectionMatrix();
}

function syncSceneModule() {
  if (!world.ready || !world.eventMaterial) return;
  const color = new THREE.Color(activeModule.visual.color);
  world.eventMaterial.color.copy(color);
  if (world.eventMaterial.emissive) {
    world.eventMaterial.emissive.copy(color);
  }
  if (world.eventBeamMaterial) {
    world.eventBeamMaterial.color.copy(color);
  }
  if (world.eventLight) {
    world.eventLight.color.copy(color);
  }
  world.connectionLines.forEach((line, agentId) => {
    line.material.color.set(agentId === activeAgent.id ? activeModule.visual.accent : agents.find((agent) => agent.id === agentId)?.color);
  });
}

function syncAgentFocus() {
  if (!world.ready) return;
  world.agentObjects.forEach((object, agentId) => {
    const selected = agentId === activeAgent.id;
    object.group.visible = !(activePerspective === "first" && selected);
    object.group.scale.setScalar(selected ? 1.42 : 1);
    object.light.intensity = selected ? 1.6 : 0.55;
    object.haloMaterial.opacity = selected ? 0.82 : 0.48;
  });
  world.connectionLines.forEach((line, agentId) => {
    line.material.opacity = agentId === activeAgent.id ? 0.92 : 0.28;
    line.material.color.set(agentId === activeAgent.id ? activeModule.visual.accent : agents.find((agent) => agent.id === agentId)?.color);
  });
}

function applySceneTime(phase, minutes) {
  if (!world.ready) return;
  const skyColor = new THREE.Color(phase.sky);
  const fogColor = new THREE.Color(phase.fog);
  world.scene.background.copy(skyColor);
  world.scene.fog.color.copy(fogColor);
  world.hemisphereLight.intensity = phase.ambient;
  world.sunLight.intensity = phase.sun;

  const angle = (minutes / 1440) * Math.PI * 2 - Math.PI / 2;
  const sunHeight = Math.max(Math.sin(angle) * 8, phase.id === "night" ? 0.4 : 1.1);
  world.sunLight.position.set(Math.cos(angle) * 7, sunHeight, Math.sin(angle) * 4);
  world.sunLight.color.set(phase.id === "dusk" ? "#ffd0a3" : "#fff1cf");

  world.roadMaterial.emissiveIntensity = phase.neon * 0.38;
  if ("emissiveIntensity" in world.windowMaterial) {
    world.windowMaterial.emissiveIntensity = phase.window;
  }
  if ("opacity" in world.windowMaterial) {
    world.windowMaterial.opacity = Math.min(0.95, 0.16 + phase.window * 0.44);
  }
  if ("emissiveIntensity" in world.neonMaterial) {
    world.neonMaterial.emissiveIntensity = phase.neon;
  }
  if ("opacity" in world.neonMaterial) {
    world.neonMaterial.opacity = Math.min(0.9, 0.14 + phase.neon * 0.32);
  }
  if ("emissiveIntensity" in world.eventMaterial) {
    world.eventMaterial.emissiveIntensity = phase.event * 0.62;
  }
  if ("opacity" in world.eventMaterial) {
    world.eventMaterial.opacity = Math.min(1, 0.34 + phase.event * 0.14);
  }
  if (world.eventBeamMaterial) {
    world.eventBeamMaterial.opacity = phase.id === "day" ? 0.1 : 0.3;
  }
  world.eventLight.intensity = phase.event;

  world.agentObjects.forEach((object, agentId) => {
    const selected = agentId === activeAgent.id;
    if ("emissiveIntensity" in object.material) {
      object.material.emissiveIntensity = phase.agent * (selected ? 1.18 : 0.72);
    }
    if ("opacity" in object.material) {
      object.material.opacity = Math.min(1, 0.44 + phase.agent * (selected ? 0.28 : 0.2));
    }
    object.light.intensity = phase.agent * (selected ? 1.06 : 0.34);
  });
}

function getTimelineIntensity() {
  if (!activeTimelineEvent) return 1;
  const age = Math.max(0, activeMinutes - activeTimelineEvent.time);
  const freshness = Math.max(0.38, 1 - age / activeTimelineEvent.duration);
  return activeTimelineEvent.intensity * freshness;
}

function applyTimelineSceneState() {
  if (!world.ready || !activeTimelineEvent) return;
  const phase = getDayPhase(activeMinutes);
  const intensity = getTimelineIntensity();
  const eventColor = new THREE.Color(activeTimelineEvent.color);
  const moduleColor = new THREE.Color(activeModule.visual.color);
  const blendedColor = moduleColor.lerp(eventColor, 0.38);

  world.eventMaterial.color.copy(blendedColor);
  world.eventMaterial.opacity = Math.min(1, 0.42 + intensity * 0.48);
  if (world.eventBeamMaterial) {
    world.eventBeamMaterial.color.copy(blendedColor);
    world.eventBeamMaterial.opacity = (phase.id === "day" ? 0.08 : 0.28) * (0.65 + intensity);
  }
  if (world.eventLight) {
    world.eventLight.color.copy(blendedColor);
    world.eventLight.intensity = phase.event * (0.72 + intensity * 0.72);
  }
  if (world.eventGroup) {
    const scale = 1 + intensity * 0.09;
    world.eventGroup.scale.set(scale, scale, scale);
  }

  world.agentObjects.forEach((object, agentId) => {
    const focused = activeTimelineEvent.focusAgents.includes(agentId);
    const selected = agentId === activeAgent.id;
    object.light.intensity *= focused ? 1.55 : 0.7;
    object.haloMaterial.opacity = focused ? (selected ? 0.95 : 0.72) : 0.28;
    object.group.scale.setScalar(selected ? 1.42 : focused ? 1.16 : 0.94);
  });

  world.connectionLines.forEach((line, agentId) => {
    const focused = activeTimelineEvent.focusAgents.includes(agentId);
    const selected = agentId === activeAgent.id;
    line.material.color.set(selected ? activeModule.visual.accent : focused ? activeTimelineEvent.color : agents.find((agent) => agent.id === agentId)?.color);
    line.material.opacity = selected ? 0.96 : focused ? 0.64 : 0.14;
  });
}

function resizeRenderer() {
  if (!world.renderer || !world.camera || !canvas) return;
  const width = Math.max(1, canvas.clientWidth);
  const height = Math.max(1, canvas.clientHeight);
  const size = new THREE.Vector2();
  world.renderer.getSize(size);
  if (size.x !== width || size.y !== height) {
    world.renderer.setSize(width, height, false);
    world.camera.aspect = width / height;
    world.camera.updateProjectionMatrix();
  }
}

function animate() {
  if (!world.renderer || !world.scene || !world.camera) return;
  requestAnimationFrame(animate);
  const elapsed = world.clock.getElapsedTime();
  resizeRenderer();

  world.eventGroup.rotation.y = elapsed * 0.18;
  world.rings.forEach((ring, index) => {
    ring.rotation.z = elapsed * ring.userData.speed;
    const pulse = 1 + Math.sin(elapsed * 1.4 + index) * 0.028;
    ring.scale.setScalar(pulse);
  });

  world.agentObjects.forEach((object, agentId) => {
    const selected = agentId === activeAgent.id;
    const bob = Math.sin(elapsed * 2.1 + agentId.length) * (selected ? 0.055 : 0.025);
    object.body.position.y = 0.42 + bob;
    object.halo.rotation.z = elapsed * (selected ? 0.8 : 0.36);
  });

  world.camera.position.lerp(world.targetPosition, 0.07);
  world.cameraLookAt.lerp(world.targetLookAt, 0.08);
  world.camera.lookAt(world.cameraLookAt);
  world.renderer.render(world.scene, world.camera);
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => selectPerspective(button.dataset.view));
});

timeScrubber.addEventListener("input", updateClock);
playButton.addEventListener("click", togglePlay);
viewTargetSelect?.addEventListener("change", () => selectViewTarget(viewTargetSelect.value));
yawControl?.addEventListener("input", () => {
  updateViewState({ yaw: Number(yawControl.value) }, { userInput: true });
});
pitchControl?.addEventListener("input", () => {
  updateViewState({ pitch: Number(pitchControl.value) }, { userInput: true });
});
zoomControl?.addEventListener("input", () => {
  updateViewState({ zoom: Number(zoomControl.value) }, { userInput: true });
});
autoOrbitButton?.addEventListener("click", () => {
  const nextAutoOrbit = !autoOrbitEnabled;
  setAutoOrbit(nextAutoOrbit);
  syncViewControls({ seekVideo: true });
});
resetViewButton?.addEventListener("click", () => {
  const state = getViewState();
  state.yaw = 0;
  state.pitch = activeViewTargetId.startsWith("agent-") ? 4 : 12;
  state.zoom = activeViewTargetId.startsWith("agent-") ? 1.18 : 1;
  setAutoOrbit(false);
  syncViewControls({ seekVideo: true });
});
remoteModeButton?.addEventListener("click", () => {
  setRenderTransportMode(renderTransportMode === "remote" ? "fallback" : "remote");
});

renderModules();
renderAgents();
renderTimeline();
renderViewTargets();
selectPerspective(activePerspective);
setActiveTimelineEvent(activeTimelineEvent);
syncModule();
syncAgent();
syncViewControls({ seekVideo: false });

initVendorFrameMode();
updateClock();

if (LOCAL_3D_ENABLED) {
  try {
    initScene();
  } catch (error) {
    console.error("3D viewport failed to start; using fallback render image.", error);
    initVendorFrameMode();
    updateClock();
  }
}
