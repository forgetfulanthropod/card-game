# Kaiju Cards - Asset Generation Roadmap (Grok Imagine)

**Goal**: Enable players to generate unique, custom game assets (cards, Kaiju characters, swords/equippables, souvenirs, backgrounds, effects, etc.) powered by Grok Imagine (xAI image generation).

**Entry Point**: User logs in with X (Twitter/X account) to get started. This unlocks generation features, rate limits, community sharing, and ties into the existing 4-account local system.

**Visual Roadmap**:
![Grok Imagine Asset Generation Roadmap](/assets/roadmap/grok-imagine-roadmap.jpg)

## Current State (as of June 2026)
- **Assets**: Hundreds of hand-crafted assets in `public/assets/`:
  - Characters/Kaiju (sprites, profiles, spines for animation): Jerry, Frog Knight, Mushroom Farmer, etc.
  - Cards: Definitions in `game/rulebook/cardDefinitionsMap.ts`, art in `cards/`, `gen0_cards/`.
  - Swords/Equippables: Part-based system (`shared/tree/Sword.ts` - blade, guard, handle, pommel) with `equipSword`, images referenced.
  - Souvenirs: `shared/tree/Souvenir.ts` + `souvenirMap`, many in `souvenirs/`.
  - Backgrounds, effects, FX sequences, hex maps, UI elements, music/sfx.
- **Asset Pipeline**: Manual creation + scripts/ for resizing/processing (see `scripts/png-to-webp`, image utils).
- **Compendium**: Recently added (see previous work). Per-account discovered items in storage. Undiscovered grayed out. Accessible from run menus (EndOfRun).
- **Auth**: Local 4-account system (username-based add/overwrite/delete via `NewStartScreen.tsx` + `server/storage.ts`). Old guest/web3 stubs remain (crypto removed).
- **No AI Generation**: All assets static. No Imagine integration.
- **Mobile**: Capacitor Android wrapper ready (`android/`, `mobile:*` scripts in `run`).

**Pain Points**:
- Manual asset creation is slow for new content, events, user-generated Kaiju.
- Limited variety for player customization.
- Compendium shows many "???" grayed items.

## High-Level Architecture
- **Frontend**: React + PixiJS UI. Add "Generate with Grok Imagine" buttons/modals in:
  - Character selection / entry scenes.
  - Card crafting / deck builder (future).
  - Compendium (unlock + generate missing).
  - Run menus / inventory (swords, souvenirs).
- **Auth Layer**: X Login required for generation (OAuth via X API or Grok session). Maps X user -> local account (extend 4-account limit or per-X credits).
- **Generation Service**:
  - Prompt builder (templates for "epic Kaiju warrior", "poison card art", "flaming sword blade").
  - Call Grok Imagine (via xAI API or integrated tool).
  - Post-process: auto-resize to webp, generate variants (normal/negative states, sprites).
  - Store in user-specific or shared bucket (e.g. `public/assets/user-generated/{x-username}/`).
- **Data Mapping**:
  - Cards: Extend `cardDefinitionsMap` with generated `image` paths + metadata.
  - Characters: Update `characterGeneration/`, profiles, spines.
  - Swords: Generate parts or full `SwordParts`, integrate with `equipSword`.
  - Souvenirs: Add to `souvenirMap`, equippable flag.
  - Compendium: Auto-mark generated as "discovered". Show "Generate" for grayed items.
- **Backend**: Server validates X session, tracks usage/credits, serves assets. Simple JSON storage extended for user-generated refs.
- **Build/Deploy**: Asset gen scripts in `scripts/generate-asset.mjs`. Capacitor handles mobile asset bundling.

## Phased Roadmap

### Phase 1: Foundation (X Login + Basic Flow) - 2-4 weeks
- **X Login Integration**:
  - Add X OAuth button to `NewStartScreen.tsx` / account picker.
  - Server: New action `loginWithX`, store X handle + link to local user_id.
  - "Login with X to unlock Imagine generation" gate. (Use existing socket/auth patterns.)
  - Mock for dev (local + fake X id); real X API keys needed.
- **Generation Hook**:
  - Add `useGrokImagine` hook or API call in client (placeholder for now).
  - Prompt templates in `client/data/imaginePrompts.ts` (e.g., for card art: "highly detailed illustration of [cardName], fantasy style, vibrant colors").
- **Basic UI**:
  - Add "Imagine Asset" button in Compendium (for grayed items).
  - Modal: Select asset type (Card / Kaiju / Sword Part / Souvenir), enter prompt or use suggested, "Generate".
  - Preview + "Accept & Use" (saves to assets, updates definitions locally for testing).
- **Deliverables**:
  - Update README with X login instructions.
  - Script: `scripts/imagine-asset.ts` (uses local Grok Imagine calls during dev).
  - Test: Generate 5 sample assets, add to compendium as discovered.
- **Testing**: Use `bash run test:poor` (poor-play bot) with generated assets in a run. Verify they appear (even if placeholder images).

### Phase 2: Asset Mapping & Integration - 3-6 weeks
- **Define Asset Taxonomy** (map every generatable thing):
  - **Cards**: Art for each in `cardDefinitionsMap`. States: normal, negative, glow.
  - **Kaiju/Characters**: Full sprite sets, profiles, idle/attack animations (use existing spines).
  - **Swords**: Individual parts (blade/guard/handle/pommel) + full assembled. See `shared/tree/Sword.ts`.
  - **Souvenirs**: Icons + equipped visuals (`souvenirs/` folder).
  - **Supporting**: Backgrounds (dungeons, events), FX (orbs, effects), UI elements, hex tiles.
- **Storage Mapping**:
  - Extend `UserRecord` + `Compendium` with `generatedAssets: { [type: string]: string[] }`.
  - New server actions: `generateAsset`, `saveGeneratedAsset(userId, type, prompt, imageUrl)`.
  - Link generated assets to runs (e.g., custom Kaiju in party).
- **Pipeline**:
  - Generate -> Auto webp conversion + variants (scripts/png-to-webp style).
  - Update `characterGeneration/` or rulebook dynamically for custom.
  - Versioning: User-generated tagged with X username + timestamp.
- **Compendium Enhancement**:
  - Grayed items now have "Generate with Grok" CTA.
  - On generate success: Mark discovered, add to user's collection, optionally equip.
- **Deliverables**:
  - Full type mappings in `shared/assets.ts` (new file).
  - Integration with existing `EquipSouvenirInterface`, `CharacterInfo` (Sword display).
  - Sample generated assets committed (or in a generated/ folder).
- **Testing**: Poor bot script extended to "use" generated custom cards/swords and die, logging "New asset unlocked in compendium".

### Phase 3: Polish, Limits & Community - 2-4 weeks
- **Rate Limits & Credits**:
  - X login grants daily generations (e.g. 5 free + more for engaged users).
  - Track in storage per X-linked account.
- **Prompt Engineering & Styles**:
  - Built-in styles: "Kaiju Cards official art", "dark fantasy", "cute chibi".
  - Negative prompts for consistency (avoid crypto/NFT looks).
- **UX & Sharing**:
  - Generated asset -> "Share to X" button (posts preview + #KaijuCards).
  - Gallery of community generations (public endpoint, filtered by X).
  - In-game: Custom assets appear in compendium with X badge.
- **Mobile**:
  - Ensure generated assets bundle correctly in Capacitor Android.
  - Add "Generate" to mobile menus.
- **Moderation**:
  - X-linked = accountable. Server-side filter bad prompts.
- **Deliverables**:
  - Update `run` script: `asset:generate`, `asset:roadmap` (serve this doc).
  - End-to-end test: X login (mock) -> generate sword part -> use in poor-play run -> see in compendium.
- **Visuals**: Use Grok Imagine itself to generate more roadmap updates or in-game promo art.

### Phase 4: Advanced & Production
- Dynamic rulebook updates from generated content.
- AI-assisted card mechanics (prompt -> DSL action strings via another Grok call).
- Procedural generation pipelines (combine Imagine + game/characterGeneration).
- Monetization/expansion: Premium X subscribers get more gens.
- Full asset replacement: Option to regenerate entire decks or maps.
- Analytics: Track most-generated asset types.

## Implementation Notes (Grok Build / Dev)
- **Tools**: Use `image_gen` (Grok Imagine) here in the build env to prototype samples and update visuals like this roadmap image.
- **Working Tree**: 
  - Add X auth stubs in `server/actions/` (new `authenticateX.ts`).
  - UI in `client/components/ImagineGenerator.tsx` + integrate with existing `Compendium.tsx`, `NewStartScreen`.
  - Extend compendium logic (already per-account).
  - Scripts in `scripts/` for batch generation.
- **Dependencies**: Add X SDK or simple OAuth if needed. Keep no-crypto rule.
- **Testing Strategy**:
  - Start with poor-play bot (`test:poor`) to exercise generated assets in full runs.
  - Compendium tests: Verify grayed vs discovered.
  - Mobile: Build + "flash" via `mobile:install`, test generation UI on device.
- **Risks**:
  - API costs for Imagine calls.
  - Consistency of generated art with existing hand-drawn style (use strong style prompts + references).
  - Storage bloat (limit per user).
- **Success Metrics**:
  - Users generate 10+ assets per session after X login.
  - Generated assets used in >20% of runs.
  - Positive feedback on custom Kaiju/swords.

## Getting Started (For Developers / Players in Roadmap)
1. Run the game: `cd card-game && npm run dev`.
2. Login with X (mock for now): In account picker, simulate X-linked username.
3. Go to a run -> End of run menu -> Compendium -> Click "Generate" on gray item.
4. (Future) Prompt + generate via Imagine -> instantly usable.
5. Use `bash run test:poor` to validate end-to-end.
6. To update visuals: Use Grok Imagine in this session and commit to `public/assets/`.

**Next Actions**:
- Implement Phase 1 X login + basic Imagine modal.
- Generate 3-5 sample custom assets using this environment's `image_gen`.
- Update `README.md` to link here.
- Tie deeper into existing compendium + mobile.

*This roadmap was established in the Grok build working tree using direct code/docs updates and Grok Imagine for the visual map.*

See also: `README.md`, previous compendium work, `server/storage.ts`, `client/components/Compendium.tsx`, `scripts/play-poorly.ts`.