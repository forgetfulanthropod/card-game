import { Container, PixiText, BASE_HEIGHT, BASE_WIDTH } from '@/elementsUtil'
import { MainCharacterAnimation, PlainButton } from './shared'
import { callApi } from '@/callApi'
import type { CharacterId } from 'shared'
import { BASE_HEIGHT, BASE_WIDTH } from '@/elementsUtil'

// Main playable / showcase characters (those with spine support)
const SHOWCASE_CHAR_IDS: CharacterId[] = [
  'frogKnight',
  'penguinKnight',
  'warhog',
  'gnomeHooligan',
  'notoriousBean',
  'snacky',
  'jerry',
  'mushroomFarmer',
  'matchaGelatinCube',
  'skeletonWarrior',
  'bloatDemon',
  'theHatefly',
  'trioOfFools',
  'wimpyGuard',
  'greenJester',
  'lichLord',
  'frogWizard',
  'bookle',
  'bumbit',
]

const COMMON_ANIMS = ['Idle', 'Attack'] as const

export function CharacterShowcaseScene() {
  const container = Container({
    name: 'CharacterShowcaseScene',
    defaultCursor: true,
  })

  // Title
  const title = new PixiText('All Characters - Animations in Unison', {
    fontFamily: 'Arial',
    fontSize: 28,
    fill: 0xffffff,
    align: 'center',
  })
  title.x = BASE_WIDTH / 2 - title.width / 2
  title.y = 20
  container.addChild(title)

  // State for current animation (shared across all)
  let currentAnim: string = 'Idle'
  const spines: any[] = []

  // Layout grid
  const cols = 6
  const cardW = 140
  const cardH = 160
  const startX = 60
  const startY = 70
  const gapX = 20
  const gapY = 30

  SHOWCASE_CHAR_IDS.forEach((id, idx) => {
    const col = idx % cols
    const row = Math.floor(idx / cols)
    const x = startX + col * (cardW + gapX)
    const y = startY + row * (cardH + gapY)

    // Label
    const label = new PixiText(id, {
      fontFamily: 'Arial',
      fontSize: 11,
      fill: 0xaaaaaa,
      align: 'center',
    })
    label.x = x + cardW / 2 - label.width / 2
    label.y = y + cardH - 18
    container.addChild(label)

    // Character anim (use MainCharacterAnimation for consistency with skins/PCs)
    let anim: any = null
    try {
      anim = MainCharacterAnimation({
        characterMeta: { id, isPc: true, uid: `showcase-${id}` as any },
        _height: 110,
      })
    } catch (e) {
      console.warn('showcase skip', id, e)
    }

    if (anim) {
      anim.x = x + cardW / 2
      anim.y = y + 90
      // Force sync animation
      try {
        anim.state.setAnimation(0, currentAnim, true)
      } catch (e) {
        // ignore if anim not present
      }
      spines.push(anim)
      container.addChild(anim)
    } else {
      // Fallback simple text if no spine
      const fallback = new PixiText(`[${id}]`, {
        fontSize: 10,
        fill: 0x666666,
      })
      fallback.x = x + 10
      fallback.y = y + 50
      container.addChild(fallback)
    }
  })

  // Animation controls (bottom) - dynamically from first spine if possible
  const btnY = BASE_HEIGHT - 50
  let btnX = 60

  function getAnims() {
    if (spines.length > 0) {
      try {
        const anims = spines[0].spineData?.animations?.map((a: any) => a.name) || []
        if (anims.length) return anims
      } catch {}
    }
    return COMMON_ANIMS
  }

  const animsToShow = getAnims()
  animsToShow.slice(0, 8).forEach((animName: string) => {
    const btn = PlainButton({
      text: animName,
      x: btnX,
      y: btnY,
      onClick: () => setAllAnimations(animName),
      width: 85,
      fontSize: 18,
    })
    container.addChild(btn)
    btnX += 92
  })

  // Re-sync all to current
  const syncBtn = PlainButton({
    text: 'Re-sync',
    x: btnX,
    y: btnY,
    onClick: () => setAllAnimations(currentAnim),
    width: 85,
    fontSize: 18,
  })
  container.addChild(syncBtn)

  // Back to menu
  const backBtn = PlainButton({
    text: 'Back',
    x: BASE_WIDTH - 120,
    y: 20,
    onClick: () => { void callApi('changeScene', { newSceneName: 'entry' } as any) },
    width: 80,
    fontSize: 16,
  })
  container.addChild(backBtn)

  function setAllAnimations(anim: string) {
    currentAnim = anim
    spines.forEach((spine) => {
      try {
        spine.state.setAnimation(0, anim, true)
      } catch (e) {
        // spine doesn't have this animation
      }
    })
  }

  // Initial sync (in case some delayed)
  setTimeout(() => setAllAnimations('Idle'), 50)

  return container
}