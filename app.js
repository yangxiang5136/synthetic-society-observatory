const modules = [
  {
    id: "software-helper",
    type: "software module",
    name: "Workflow Helper",
    title: "Neutral software assistant trial",
    summary: "A tool promise enters the district through a public service desk.",
    payload: "purpose: reduce paperwork friction",
    location: "mixed-use district / public service desk",
    ontology: "Agents classify it through time pressure, setup cost, trust, and fallback options.",
    response: "Early try, cautious delay, peer explanation, and offline workaround appear in parallel.",
    metrics: [
      ["Curiosity", 72],
      ["Setup concern", 48],
      ["Peer verification", 64],
      ["Offline fallback", 38]
    ]
  },
  {
    id: "hardware-sensor",
    type: "hardware module",
    name: "Wearable Signal Tag",
    title: "Lightweight device field trial",
    summary: "A small physical device is introduced as a safety and coordination aid.",
    payload: "weight: 42g / dimensions: 58x34x12mm / purpose: signal status",
    location: "transit edge / repair counter",
    ontology: "Agents classify it through comfort, battery, privacy, durability, and visible usefulness.",
    response: "Hands-on testers move first; privacy-sensitive agents ask who can see the signal.",
    metrics: [
      ["Hands-on trial", 68],
      ["Privacy concern", 61],
      ["Device friction", 44],
      ["Practical utility", 76]
    ]
  },
  {
    id: "public-policy",
    type: "institution event",
    name: "Access Rule Change",
    title: "Public rule update",
    summary: "A local rule changes how people access a shared resource.",
    payload: "scope: shared facility / effect: queue and permission change",
    location: "community hub / notice board",
    ontology: "Agents classify it through fairness, inconvenience, authority trust, and workaround paths.",
    response: "Some comply, some seek clarification, some route around the new rule.",
    metrics: [
      ["Compliance", 58],
      ["Clarification need", 73],
      ["Authority trust", 42],
      ["Workaround search", 55]
    ]
  }
];

const agents = [
  {
    id: "agent-001",
    initials: "MV",
    name: "Mara Vale",
    role: "night-shift operator",
    need: "needs reliable time savings",
    read: "Classifies the event as useful only if it lowers repeated work without adding setup overhead.",
    question: "Will it save time tonight?",
    action: "tries with a fallback ready",
    color: "#f2c15f"
  },
  {
    id: "agent-002",
    initials: "IK",
    name: "Iko Ren",
    role: "repair hobbyist",
    need: "needs hands-on proof",
    read: "Treats any module as a thing to inspect, test, and compare against lived device failures.",
    question: "Can I see how it fails?",
    action: "tests the edge case first",
    color: "#77bfea"
  },
  {
    id: "agent-003",
    initials: "SN",
    name: "Sana North",
    role: "caregiver",
    need: "needs predictable routines",
    read: "Reads novelty through disruption risk and whether the module makes coordination gentler.",
    question: "Will this interrupt the routine?",
    action: "asks for a low-risk trial",
    color: "#f17662"
  },
  {
    id: "agent-004",
    initials: "DR",
    name: "Daren Li",
    role: "delivery rider",
    need: "needs fast visible utility",
    read: "Ranks the event by immediate route value, battery cost, and whether others already trust it.",
    question: "Does this help before the next stop?",
    action: "adopts only if friction is tiny",
    color: "#4cd5ae"
  },
  {
    id: "agent-005",
    initials: "MO",
    name: "Mio Park",
    role: "small shop owner",
    need: "needs customer calm",
    read: "Watches how the event changes questions, queues, and confidence inside a public space.",
    question: "Will customers argue about it?",
    action: "becomes a cautious explainer",
    color: "#eadc72"
  },
  {
    id: "agent-006",
    initials: "TA",
    name: "Tala Gray",
    role: "campus maker",
    need: "needs remixable tools",
    read: "Looks for whether the module can be understood, modified, and used in a small project.",
    question: "Can I adapt it?",
    action: "experiments then shares notes",
    color: "#b6a2ff"
  },
  {
    id: "agent-007",
    initials: "OR",
    name: "Oren Kai",
    role: "skeptical admin",
    need: "needs auditability",
    read: "Converts platform claims into policy, logging, accountability, and support burden questions.",
    question: "Who is responsible if it breaks?",
    action: "requires documentation first",
    color: "#9bb592"
  },
  {
    id: "agent-008",
    initials: "JE",
    name: "Jessa Moon",
    role: "event organizer",
    need: "needs crowd coordination",
    read: "Reads the event through group flow, social proof, and whether it reduces confusion at scale.",
    question: "Will the group understand it together?",
    action: "pilots it with a small group",
    color: "#f29bb6"
  }
];

let activeModule = modules[0];
let activeAgent = agents[0];
let isPlaying = false;
let timer = null;

const moduleRack = document.querySelector("#moduleRack");
const agentRail = document.querySelector("#agentRail");
const impactRows = document.querySelector("#impactRows");
const playButton = document.querySelector("#playButton");
const clockLabel = document.querySelector("#clockLabel");
const timeScrubber = document.querySelector("#timeScrubber");

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

function selectModule(moduleId) {
  activeModule = modules.find((module) => module.id === moduleId) || modules[0];
  syncModule();
}

function selectAgent(agentId) {
  activeAgent = agents.find((agent) => agent.id === agentId) || agents[0];
  syncAgent();
}

function syncModule() {
  const scenarioTitle = document.querySelector("#activeScenarioTitle");
  if (scenarioTitle) {
    scenarioTitle.textContent = activeModule.title;
  }
  document.querySelector("#activeLocation").textContent = activeModule.location;
  document.querySelector("#activeModuleType").textContent = activeModule.type;
  document.querySelector("#activeModuleName").textContent = activeModule.name;
  document.querySelector("#activeModulePayload").textContent = activeModule.payload;
  document.querySelector("#eventSummary").textContent = activeModule.summary;
  document.querySelector("#ontologySummary").textContent = activeModule.ontology;
  document.querySelector("#responseSummary").textContent = activeModule.response;
  renderImpactRows();

  document.querySelectorAll(".module-card").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.module === activeModule.id);
  });
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
}

function updateClock() {
  const minutes = Number(timeScrubber.value);
  const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mins = String(minutes % 60).padStart(2, "0");
  clockLabel.textContent = `T+${hours}:${mins}`;
}

function togglePlay() {
  isPlaying = !isPlaying;
  playButton.textContent = isPlaying ? "Pause Slice" : "Play Slice";

  if (isPlaying) {
    timer = window.setInterval(() => {
      const next = (Number(timeScrubber.value) + 10) % 2881;
      timeScrubber.value = String(next);
      updateClock();
    }, 650);
  } else {
    window.clearInterval(timer);
  }
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-view]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
  });
});

timeScrubber.addEventListener("input", updateClock);
playButton.addEventListener("click", togglePlay);

renderModules();
renderAgents();
syncModule();
syncAgent();
updateClock();
