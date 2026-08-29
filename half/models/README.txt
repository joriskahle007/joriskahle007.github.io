Enemy model folder
===================

Drop GLB model files here, named after an enemy type from ENEMY_TYPES in game.js:

    stalker.glb      -> fast orange rifle foe
    brute.glb        -> big green plasma bruiser
    sentinel.glb     -> purple hovering caster (3-round burst)

Rules
-----
- Format: glTF binary (.glb). Animated clips are auto-matched by name:
    idle / stand / breath   -> idle
    walk / run / move       -> walk
    attack / atk / shoot    -> attack
    death / die / dead      -> death
  If a clip is missing it falls back to idle, so static or partially
  animated models still work.
- Licensing: only place models you are allowed to use (CC0 or commercial
  license you own). Models loaded here are used as-is.
- Resolution / loading: when running from a local web server
  (e.g. `python -m http.server` in this folder) these files are loaded
  automatically. When opening index.html via file:// the browser blocks
  local fetches, so the built-in fallback model is used instead.
- Adding a NEW enemy type: add an entry to ENEMY_TYPES in game.js and a
  matching <type>.glb here. No other code changes are required.
- If a file is missing or fails to load, the game keeps the embedded
  fallback model, so the game always stays playable.
