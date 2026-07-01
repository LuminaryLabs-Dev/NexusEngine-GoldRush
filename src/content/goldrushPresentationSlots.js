export const goldRushSceneSlots = [
  {
    id: "goldrush.scene.boot",
    legacyRole: "browser-boot-sequence",
    browserRole: "runtime initialization before legacy scene intent is available",
    placeholder: { band: "boot", color: "#101416" },
  },
  {
    id: "goldrush.scene.loading",
    legacyRole: "GoldRush/Assets/Scenes/Loading.unity",
    browserRole: "loading and room handoff interstitial",
    placeholder: { band: "loading", color: "#283238" },
  },
  {
    id: "goldrush.scene.mainMenu",
    legacyRole: "GoldRush_Old/Assets/_GOLDRUSH/00_Scenes/MainMenu.unity",
    browserRole: "title/menu atmosphere reference",
    placeholder: { band: "menu", color: "#171c1e" },
  },
  {
    id: "goldrush.scene.lobby",
    legacyRole: "GoldRush/Assets/Scenes/Lobby.unity",
    browserRole: "matchmaking and room staging",
    placeholder: { band: "lobby", color: "#35383a" },
  },
  {
    id: "goldrush.scene.arena",
    legacyRole: "GoldRush/Assets/Scenes/Arena.unity",
    browserRole: "massive extraction terrain made from small tessellated patches",
    placeholder: { band: "terrain-patch-field", color: "#9b7a45" },
  },
  {
    id: "goldrush.scene.results",
    legacyRole: "modern post-extraction results and replay summary",
    browserRole: "winner, score, extraction contest, and replay digest",
    placeholder: { band: "results-summary", color: "#191f20" },
  },
  {
    id: "goldrush.scene.playerTest",
    legacyRole: "GoldRush/Assets/Entities/Player/PlayerTest.unity",
    browserRole: "player controller and animation validation scene",
    placeholder: { band: "player-test", color: "#2f4441" },
  },
  {
    id: "goldrush.scene.legacyGame",
    legacyRole: "GoldRush_Old/Assets/_GOLDRUSH/00_Scenes/Game.unity",
    browserRole: "classic gameplay and combat layout reference",
    placeholder: { band: "legacy-combat", color: "#7a4d2a" },
  },
  {
    id: "goldrush.scene.legacySinglePlayer",
    legacyRole: "GoldRush_Old/Assets/_GOLDRUSH/00_Scenes/Game_SinglePlayer.unity",
    browserRole: "solo loop and camera behavior reference",
    placeholder: { band: "legacy-solo", color: "#4f8a5b" },
  },
];

export const goldRushTransitionSlots = [
  {
    id: "goldrush.transition.bootToMainMenu",
    from: "goldrush.scene.boot",
    to: "goldrush.scene.mainMenu",
    audioCueId: "goldrush.audio.music.titleIntro",
    animationCueId: "goldrush.anim.player.idle",
  },
  {
    id: "goldrush.transition.mainMenuToLobby",
    from: "goldrush.scene.mainMenu",
    to: "goldrush.scene.lobby",
    audioCueId: "goldrush.audio.music.wandering",
    animationCueId: "goldrush.anim.player.run",
  },
  {
    id: "goldrush.transition.mainMenuToGame",
    from: "goldrush.scene.mainMenu",
    to: "goldrush.scene.legacyGame",
    audioCueId: "goldrush.audio.music.wandering",
    animationCueId: "goldrush.anim.player.run",
  },
  {
    id: "goldrush.transition.lobbyToArena",
    from: "goldrush.scene.lobby",
    to: "goldrush.scene.arena",
    audioCueId: "goldrush.audio.music.wandering",
    animationCueId: "goldrush.anim.player.run",
  },
  {
    id: "goldrush.transition.loadingToArena",
    from: "goldrush.scene.loading",
    to: "goldrush.scene.arena",
    audioCueId: "goldrush.audio.music.wandering",
    animationCueId: "goldrush.anim.player.run",
  },
  {
    id: "goldrush.transition.explorationToCombat",
    from: "goldrush.scene.arena",
    to: "goldrush.scene.legacyGame",
    audioCueId: "goldrush.audio.sfx.ambush",
    animationCueId: "goldrush.anim.player.aimIdle",
  },
  {
    id: "goldrush.transition.combatToExploration",
    from: "goldrush.scene.legacyGame",
    to: "goldrush.scene.arena",
    audioCueId: "goldrush.audio.music.wandering",
    animationCueId: "goldrush.anim.player.run",
  },
  {
    id: "goldrush.transition.combatToBoss",
    from: "goldrush.scene.legacyGame",
    to: "goldrush.scene.legacyGame",
    audioCueId: "goldrush.audio.music.boss",
    animationCueId: "goldrush.anim.player.aimRun",
  },
  {
    id: "goldrush.transition.cashoutComplete",
    from: "goldrush.scene.arena",
    to: "goldrush.scene.results",
    audioCueId: "goldrush.audio.sfx.cashout",
    animationCueId: "goldrush.anim.player.idle",
  },
  {
    id: "goldrush.transition.playerEliminated",
    from: "goldrush.scene.legacyGame",
    to: "goldrush.scene.legacyGame",
    audioCueId: "goldrush.audio.sfx.playerDown",
    animationCueId: "goldrush.anim.player.dead",
  },
  {
    id: "goldrush.transition.roomHandoffStart",
    from: "goldrush.scene.arena",
    to: "goldrush.scene.loading",
    audioCueId: "goldrush.audio.music.wandering",
    animationCueId: "goldrush.anim.player.run",
  },
  {
    id: "goldrush.transition.roomHandoffComplete",
    from: "goldrush.scene.loading",
    to: "goldrush.scene.arena",
    audioCueId: "goldrush.audio.music.wandering",
    animationCueId: "goldrush.anim.player.run",
  },
];

export const goldRushAudioSlots = [
  { id: "goldrush.audio.music.titleIntro", legacyRole: "MainMenu AudioSource play-on-awake intro", type: "music" },
  { id: "goldrush.audio.voice.titleIntro", legacyRole: "MainMenu voice/title callout", type: "voice" },
  { id: "goldrush.audio.music.wandering", legacyRole: "MusicManager.Wandering", type: "music" },
  { id: "goldrush.audio.music.combat", legacyRole: "MusicManager.Combat", type: "music" },
  { id: "goldrush.audio.music.boss", legacyRole: "MusicManager.Boss", type: "music" },
  { id: "goldrush.audio.sfx.revolverShot", legacyRole: "PlayerController gunshot AudioSource", type: "combat" },
  { id: "goldrush.audio.sfx.goldPickup", legacyRole: "gold pickup cue", type: "action" },
  { id: "goldrush.audio.sfx.goldDrop", legacyRole: "gold dropped cue", type: "action" },
  { id: "goldrush.audio.sfx.cashout", legacyRole: "cashout reward cue", type: "reward" },
  { id: "goldrush.audio.sfx.ambush", legacyRole: "combat enter cue", type: "transition" },
  { id: "goldrush.audio.sfx.playerDown", legacyRole: "player eliminated cue", type: "combat" },
  { id: "goldrush.audio.bus.master", legacyRole: "GameAudio.mixer master", type: "bus" },
  { id: "goldrush.audio.bus.music", legacyRole: "GameAudio.mixer music", type: "bus" },
  { id: "goldrush.audio.bus.sfx", legacyRole: "GameAudio.mixer sfx", type: "bus" },
];

export const goldRushAnimationSlots = [
  { id: "goldrush.anim.player.idle", legacyRole: "Idle", target: "player" },
  { id: "goldrush.anim.player.run", legacyRole: "Run", target: "player" },
  { id: "goldrush.anim.player.dash", legacyRole: "Dashing", target: "player" },
  { id: "goldrush.anim.player.aimIdle", legacyRole: "Aim Idle", target: "player" },
  { id: "goldrush.anim.player.aimRun", legacyRole: "Aim Run", target: "player" },
  { id: "goldrush.anim.player.aimJump", legacyRole: "Aim Jump", target: "player" },
  { id: "goldrush.anim.player.shooting", legacyRole: "IsShooting", target: "player" },
  { id: "goldrush.anim.player.dead", legacyRole: "Dead", target: "player" },
  { id: "goldrush.anim.state.speed", legacyRole: "Speed parameter", target: "state" },
  { id: "goldrush.anim.state.isShooting", legacyRole: "IsShooting parameter", target: "state" },
  { id: "goldrush.anim.state.isAiming", legacyRole: "IsAiming parameter", target: "state" },
  { id: "goldrush.anim.state.isRunning", legacyRole: "IsRunning parameter", target: "state" },
  { id: "goldrush.anim.state.isJumping", legacyRole: "IsJumping parameter", target: "state" },
  { id: "goldrush.anim.state.combatState", legacyRole: "Suspicious/InCombat/OutOfCombat", target: "state" },
];

export function createPresentationRegistry() {
  return {
    version: "0.1.0",
    source: "placeholder-presentation-slots",
    pendingCloudImport: true,
    scenes: goldRushSceneSlots.map(toPlaceholderRecord),
    transitions: goldRushTransitionSlots.map(toPlaceholderRecord),
    audio: goldRushAudioSlots.map(toPlaceholderRecord),
    animations: goldRushAnimationSlots.map(toPlaceholderRecord),
  };
}

function toPlaceholderRecord(slot) {
  return {
    ...slot,
    status: "placeholder",
    runtimePath: null,
    sourceJobId: null,
    provenance: "pending-cloud-import",
  };
}
