const cuePolicy = {
  "goldrush.audio.music.titleIntro": {
    family: "music",
    legacyPosition: "MainMenu AudioSource, play on awake",
    fallbackPattern: "title",
  },
  "goldrush.audio.music.wandering": {
    family: "music",
    legacyPosition: "MusicManager.Wandering",
    fallbackPattern: "wandering",
  },
  "goldrush.audio.music.combat": {
    family: "music",
    legacyPosition: "MusicManager.Combat",
    fallbackPattern: "combat",
  },
  "goldrush.audio.music.boss": {
    family: "music",
    legacyPosition: "MusicManager.Boss",
    fallbackPattern: "combat",
  },
  "goldrush.audio.voice.titleIntro": {
    family: "voice",
    legacyPosition: "MainMenu title voice callout",
    fallbackPattern: "title",
  },
  "goldrush.audio.sfx.revolverShot": {
    family: "sfx",
    legacyPosition: "Player.prefab shootAudioSource",
    fallbackPattern: "shot",
  },
  "goldrush.audio.sfx.goldPickup": {
    family: "sfx",
    legacyPosition: "gold pickup cue",
    fallbackPattern: "pickup",
  },
  "goldrush.audio.sfx.cashout": {
    family: "sfx",
    legacyPosition: "cashout reward cue",
    fallbackPattern: "cashout",
  },
  "goldrush.audio.sfx.ambush": {
    family: "sfx",
    legacyPosition: "combat enter cue",
    fallbackPattern: "combat",
  },
  "goldrush.audio.sfx.playerDown": {
    family: "sfx",
    legacyPosition: "player eliminated cue",
    fallbackPattern: "down",
  },
};

const fallbackPatterns = {
  title: [
    { frequency: 196, gain: 0.12 },
    { frequency: 246.94, gain: 0.09 },
    { frequency: 293.66, gain: 0.1 },
    { rest: true },
  ],
  wandering: [
    { frequency: 220, gain: 0.08 },
    { rest: true },
    { frequency: 246.94, gain: 0.07 },
    { frequency: 329.63, gain: 0.075 },
  ],
  combat: [
    { frequency: 130.81, gain: 0.12 },
    { frequency: 146.83, gain: 0.11 },
    { rest: true },
    { frequency: 174.61, gain: 0.1 },
  ],
};

export function createGoldRushAudioManager({ getAssetRegistry = () => null } = {}) {
  let context = null;
  let master = null;
  let musicElement = null;
  let currentMusicCueId = null;
  let fallbackTimer = null;
  let fallbackStep = 0;
  let unlocked = false;
  const playedOneShots = new Set();
  const state = {
    status: "locked",
    currentMusicCueId: null,
    currentMusicSource: "none",
    currentFallbackPattern: null,
    lastOneShots: [],
    pendingApprovedRuntimeAssets: [],
    legacyPositions: structuredClone(cuePolicy),
  };

  function start() {
    unlocked = true;
    ensureContext();
    state.status = "started";
    return snapshot();
  }

  function sync({ screen = "start", scenario = null, loadingPhase = null, fired = false } = {}) {
    const musicCueId = resolveMusicCueId({ screen, scenario, loadingPhase });
    playMusicCue(musicCueId);
    const oneShots = collectOneShots({ scenario, fired, loadingPhase });
    for (const shot of oneShots) playOneShot(shot);
    state.lastOneShots = oneShots.slice(-8);
    return snapshot();
  }

  function stop() {
    stopFallbackMusic();
    if (musicElement) {
      musicElement.pause();
      musicElement = null;
    }
    currentMusicCueId = null;
    state.currentMusicCueId = null;
    state.currentMusicSource = "none";
    state.currentFallbackPattern = null;
    return snapshot();
  }

  function playMusicCue(cueId) {
    if (!unlocked || !cueId || currentMusicCueId === cueId) return;
    currentMusicCueId = cueId;
    state.currentMusicCueId = cueId;
    const record = resolveAudioRecord(cueId);
    const url = runtimeUrl(record?.runtimePath);
    if (url) {
      stopFallbackMusic();
      playMusicElement(url);
      state.currentMusicSource = "approved-runtime-asset";
      state.currentFallbackPattern = null;
      return;
    }
    state.currentMusicSource = "procedural-fallback";
    state.currentFallbackPattern = cuePolicy[cueId]?.fallbackPattern ?? "wandering";
    rememberPending(cueId);
    startFallbackMusic(state.currentFallbackPattern);
  }

  function playOneShot({ cueId, dedupeId }) {
    if (!unlocked || !cueId || !dedupeId || playedOneShots.has(dedupeId)) return;
    playedOneShots.add(dedupeId);
    const record = resolveAudioRecord(cueId);
    const url = runtimeUrl(record?.runtimePath);
    if (url) {
      const element = new Audio(url);
      element.volume = cuePolicy[cueId]?.family === "voice" ? 0.72 : 0.55;
      element.play().catch(() => {});
      return;
    }
    rememberPending(cueId);
    playFallbackOneShot(cuePolicy[cueId]?.fallbackPattern ?? "pickup");
  }

  function resolveAudioRecord(cueId) {
    const registry = getAssetRegistry();
    return registry?.presentation?.audio?.find((entry) => entry.id === cueId) ?? null;
  }

  function rememberPending(cueId) {
    if (!state.pendingApprovedRuntimeAssets.includes(cueId)) {
      state.pendingApprovedRuntimeAssets.push(cueId);
      state.pendingApprovedRuntimeAssets.sort();
    }
  }

  function snapshot() {
    return structuredClone({
      ...state,
      unlocked,
      approvedRuntimeReady: state.currentMusicSource === "approved-runtime-asset",
    });
  }

  return {
    start,
    sync,
    stop,
    snapshot,
  };

  function ensureContext() {
    if (context) return;
    const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioContextClass) return;
    context = new AudioContextClass();
    master = context.createGain();
    master.gain.value = 0.14;
    master.connect(context.destination);
    if (context.state === "suspended") context.resume();
  }

  function playMusicElement(url) {
    if (musicElement) musicElement.pause();
    musicElement = new Audio(url);
    musicElement.loop = true;
    musicElement.volume = 0.45;
    musicElement.play().catch(() => {
      state.currentMusicSource = "approved-runtime-playback-blocked";
    });
  }

  function startFallbackMusic(patternId) {
    ensureContext();
    if (!context || !master || fallbackTimer) return;
    fallbackStep = 0;
    const playStep = () => {
      const pattern = fallbackPatterns[patternId] ?? fallbackPatterns.wandering;
      const note = pattern[fallbackStep % pattern.length];
      if (!note.rest) playPluck({ ...note, duration: patternId === "combat" ? 0.12 : 0.18 });
      if (fallbackStep % 4 === 0) playTap(patternId === "combat" ? 0.07 : 0.045);
      fallbackStep += 1;
    };
    playStep();
    fallbackTimer = window.setInterval(playStep, patternId === "combat" ? 360 : 520);
  }

  function stopFallbackMusic() {
    if (!fallbackTimer) return;
    window.clearInterval(fallbackTimer);
    fallbackTimer = null;
  }

  function playFallbackOneShot(patternId) {
    ensureContext();
    if (!context || !master) return;
    if (patternId === "shot") {
      playTap(0.16, 820);
      playPluck({ frequency: 92.5, gain: 0.16, duration: 0.08 });
      return;
    }
    if (patternId === "cashout") {
      [329.63, 392, 493.88].forEach((frequency, index) => {
        window.setTimeout(() => playPluck({ frequency, gain: 0.08, duration: 0.16 }), index * 70);
      });
      return;
    }
    if (patternId === "down") {
      playPluck({ frequency: 98, gain: 0.12, duration: 0.28 });
      return;
    }
    playPluck({ frequency: 587.33, gain: 0.08, duration: 0.12 });
  }

  function playPluck({ frequency, gain, duration = 0.18 }) {
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const toneGain = context.createGain();
    const filter = context.createBiquadFilter();
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(frequency, now);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1050, now);
    toneGain.gain.setValueAtTime(0.0001, now);
    toneGain.gain.exponentialRampToValueAtTime(gain, now + 0.012);
    toneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(filter);
    filter.connect(toneGain);
    toneGain.connect(master);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  function playTap(gain = 0.05, cutoff = 420) {
    const now = context.currentTime;
    const buffer = context.createBuffer(1, context.sampleRate * 0.045, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) {
      data[index] = (Math.random() * 2 - 1) * (1 - index / data.length);
    }
    const source = context.createBufferSource();
    const noiseGain = context.createGain();
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff, now);
    noiseGain.gain.setValueAtTime(gain, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
    source.buffer = buffer;
    source.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(master);
    source.start(now);
  }
}

function resolveMusicCueId({ screen, scenario, loadingPhase }) {
  if (screen === "start") return "goldrush.audio.music.titleIntro";
  if (screen === "lobby" || screen === "loading") return "goldrush.audio.music.wandering";
  if (loadingPhase === "departing" || loadingPhase === "handoff") return "goldrush.audio.music.wandering";
  return scenario?.audioState?.musicCueId ?? "goldrush.audio.music.wandering";
}

function collectOneShots({ scenario, fired, loadingPhase }) {
  const shots = [];
  for (const shot of scenario?.audioState?.oneShots ?? []) {
    shots.push({ cueId: shot.cueId, dedupeId: `scene.${shot.dedupeId}` });
  }
  if (fired) {
    shots.push({ cueId: "goldrush.audio.sfx.revolverShot", dedupeId: `fire.direct.${performance.now().toFixed(0)}` });
  }
  for (const event of scenario?.extractionLoop?.events ?? []) {
    const cueId = cueForExtractionEvent(event.type);
    if (cueId) shots.push({ cueId, dedupeId: `loop.${event.id}` });
  }
  if (loadingPhase === "departing") {
    shots.push({ cueId: "goldrush.audio.voice.titleIntro", dedupeId: "loading.train.departing.voice" });
  }
  return shots;
}

function cueForExtractionEvent(type) {
  if (type === "gold-mined") return "goldrush.audio.sfx.goldPickup";
  if (type === "extracted") return "goldrush.audio.sfx.cashout";
  if (type === "shot-hit" || type === "shot-missed") return "goldrush.audio.sfx.revolverShot";
  if (type === "damage") return "goldrush.audio.sfx.ambush";
  return null;
}

function runtimeUrl(runtimePath) {
  if (!runtimePath || typeof window === "undefined") return null;
  if (!runtimePath.startsWith("assets/")) return null;
  return new URL(runtimePath, `${window.location.origin}${import.meta.env.BASE_URL}`).href;
}
