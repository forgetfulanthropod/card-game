import { Container, Text, BASE_WIDTH, BASE_HEIGHT, PixiContainer, Graphics } from '@/elementsUtil'
import { PlainButton, MainCharacterAnimation } from './shared'
import { callApi } from '@/callApi'
import { collectData } from '@/analytics/collectData'
import { onUpdate } from '@/util'
import { getScene, getTree } from '@/data'
import { ScrollBox } from '@pixi/ui'

// Real purchasable characters (ids match playerCharacterStatsMap keys from prepared state)
function getCharList() {
  let list = [
    'frogKnight', 'gnomeHooligan', 'warhog', 'notoriousBean', 'penguinKnight',
    'skeletonWarrior', 'matchaGelatinCube', 'mushroomFarmer', 'snacky', 'jerry'
  ]
  try {
    const sceneData = getScene ? getScene().get() : null
    if (sceneData && Array.isArray(sceneData.allCharacterOptions) && sceneData.allCharacterOptions.length) {
      list = sceneData.allCharacterOptions.map((c: any) => c && c.id).filter(Boolean)
    }
  } catch {}
  return list
}

// Sample items for sale
const ITEM_LIST = [
  { id: 'gemBooster', name: 'Gem Booster', price: 5, desc: '+gems economy' },
  { id: 'xpBooster', name: 'XP Booster', price: 8, desc: 'faster progress' },
  { id: 'starterPack', name: 'Starter Pack', price: 12, desc: 'mixed goodies' },
]

// Simulated distinct players/sellers for marketplace listings (per AC: shows from different players; attributions added in display layer)
const SELLERS = ['Player42', 'KaijuFan99', 'SatoshiCards', 'GemLord42', 'DungeonMasterX', 'PixelPwner', 'CryptoKnight', 'FrogCollector42']

// Whimsical stall/booth row helpers - playful text + decorative grouping, keep seller exact and buy wiring
function createWhimsicalStallRow(cid: string, seller: string, price: number, onBuy: () => void) {
  const row = Container({ name: `stall-${cid}` })
  const desc = Text({ text: `A plucky ${cid} companion beckons!`, style: { fontFamily: 'Arial', fontSize: 14, fill: 0xdddddd }, width: 420 })
  desc.x = 0; desc.y = 0; row.addChild(desc)
  const sellerSign = Text({ text: `(by ${seller})`, style: { fontFamily: 'Arial', fontSize: 11, fill: 0xaaaaaa } })
  sellerSign.x = 0; sellerSign.y = 16; row.addChild(sellerSign)
  const priceFlair = Text({ text: `A mere ${price} gems!`, style: { fontFamily: 'Arial', fontSize: 11, fill: 0xffcc66 } })
  priceFlair.x = 0; priceFlair.y = 30; row.addChild(priceFlair)
  const buyBtn = PlainButton({ text: 'Acquire!', x: 480, y: 24, onClick: onBuy, width: 85, fontSize: 11 })
  row.addChild(buyBtn)
  return row
}

function createWhimsicalBoothRow(it: {id:string, name:string, price:number, desc:string}, seller: string, onBuy: () => void) {
  const row = Container({ name: `booth-${it.id}` })
  const desc = Text({ text: `${it.name} (${it.desc}) shimmers temptingly!`, style: { fontFamily: 'Arial', fontSize: 14, fill: 0xdddddd }, width: 420 })
  desc.x = 0; desc.y = 0; row.addChild(desc)
  const sellerSign = Text({ text: `(by ${seller})`, style: { fontFamily: 'Arial', fontSize: 11, fill: 0xaaaaaa } })
  sellerSign.x = 0; sellerSign.y = 16; row.addChild(sellerSign)
  const priceFlair = Text({ text: `A mere ${it.price} gems!`, style: { fontFamily: 'Arial', fontSize: 11, fill: 0xffcc66 } })
  priceFlair.x = 0; priceFlair.y = 30; row.addChild(priceFlair)
  const buyBtn = PlainButton({ text: 'Acquire!', x: 480, y: 24, onClick: onBuy, width: 85, fontSize: 11 })
  row.addChild(buyBtn)
  return row
}

export function MarketplaceScene(): PixiContainer {
  collectData('ui_ux_view', { page_title: 'Marketplace' })

  const container = Container({ name: 'MarketplaceScene', defaultCursor: true })

  // Title - whimsical emporium theme
  const title = Text({
    text: 'Ye Olde Whimsical Emporium',
    style: { fontFamily: 'Arial', fontSize: 28, fill: 0xffee88, align: 'center' },
  })
  title.x = BASE_WIDTH / 2 - title.width / 2
  title.y = 20
  container.addChild(title)

  // Balance (live from events.gems)
  const balance = Text({
    text: 'Gems: ?',
    style: { fontFamily: 'Arial', fontSize: 20, fill: 0x88ff88 },
  })
  balance.x = BASE_WIDTH - 180
  balance.y = 20
  container.addChild(balance)

  try {
    const gemsCursor = getTree().select('events').select('gems')
    onUpdate(gemsCursor, (g: number) => {
      balance.text = `Gems: ${g || 0}`
    }, true)
  } catch {}

  const CHAR_LIST = getCharList()

  // Common e-commerce masonry grid with animating character previews + seller tags
  const MARGIN = 70
  const GAP = 16
  const COLS = 5
  const usableW = BASE_WIDTH - MARGIN * 2
  const cardW = Math.floor((usableW - (COLS - 1) * GAP) / COLS)
  const previewH = Math.floor(cardW * 0.9)
  const infoH = 68
  const cardH = previewH + infoH

  const content = Container({ name: 'masonryContent' })
  let curY = 8

  // helper to draw a card bg
  function makeCardBg(w: number, h: number, color = 0x151526) {
    return Graphics({
      draw: (g: any) => {
        g.beginFill(color, 1)
        g.drawRoundedRect(0, 0, w, h, 8)
        g.endFill()
        g.lineStyle(1.5, 0x3a3a55, 1)
        g.drawRoundedRect(0, 0, w, h, 8)
      }
    })
  }

  function makePreviewFrame(w: number, h: number) {
    return Graphics({
      draw: (g: any) => {
        g.beginFill(0x0a0a12, 1)
        g.drawRoundedRect(0, 0, w, h, 4)
        g.endFill()
        g.lineStyle(1, 0x2a2a44)
        g.drawRoundedRect(0, 0, w, h, 4)
      }
    })
  }

  function createListingCard(listing: any, isChar: boolean, onBuy: () => void) {
    const card = Container({ name: `card-${listing.id}` })
    card.addChild(makeCardBg(cardW, cardH))

    // preview square
    const pFrame = makePreviewFrame(cardW - 12, previewH)
    pFrame.x = 6
    pFrame.y = 6
    card.addChild(pFrame)

    if (isChar) {
      try {
        const anim = MainCharacterAnimation({
          characterMeta: { id: listing.id, isPc: true, uid: `mkt-${listing.id}` as any },
          _height: previewH - 12,
        })
        if (anim) {
          anim.x = cardW / 2
          anim.y = 6 + previewH / 2 + 2
          try { anim.state?.setAnimation(0, 'Idle', true) } catch {}
          card.addChild(anim)
        }
      } catch {
        const fb = Text({ text: `[${listing.id}]`, style: { fontSize: 10, fill: 0x555577 } })
        fb.x = 12
        fb.y = 12
        card.addChild(fb)
      }
    } else {
      // item square
      const itemSq = Graphics({
        draw: (g: any) => {
          g.beginFill(0x223344, 1)
          g.drawRoundedRect(0, 0, cardW - 12, previewH, 4)
          g.endFill()
        }
      })
      itemSq.x = 6
      itemSq.y = 6
      card.addChild(itemSq)
      const nm = Text({
        text: listing.name || listing.id,
        style: { fontSize: 12, fill: 0x99aaff, align: 'center' }
      })
      nm.x = 6 + (cardW - 12) / 2 - nm.width / 2
      nm.y = 6 + previewH / 2 - 8
      card.addChild(nm)
    }

    // name line
    const title = Text({
      text: isChar ? `A plucky ${listing.id}` : listing.name,
      style: { fontSize: 11, fill: 0xddddee, wordWrap: true, wordWrapWidth: cardW - 12 }
    })
    title.x = 6
    title.y = 6 + previewH + 3
    card.addChild(title)

    // seller tag
    const tagW = Math.min(118, cardW - 12)
    const tag = Container({})
    tag.addChild(Graphics({
      draw: (g: any) => {
        g.beginFill(0x1f2a3a, 1)
        g.drawRoundedRect(0, 0, tagW, 14, 2)
        g.endFill()
      }
    }))
    const stag = Text({
      text: `by ${listing.seller}`,
      style: { fontSize: 9, fill: 0x77aaff }
    })
    stag.x = 3
    stag.y = 1
    tag.addChild(stag)
    tag.x = 6
    tag.y = title.y + title.height + 2
    card.addChild(tag)

    // price
    const pr = Text({
      text: `${listing.price}g`,
      style: { fontSize: 10, fill: 0xffcc66 }
    })
    pr.x = 6
    pr.y = tag.y + 16
    card.addChild(pr)

    // buy button
    const buy = PlainButton({
      text: 'Buy',
      x: cardW - 58,
      y: 6 + previewH + 6,
      onClick: onBuy,
      width: 52,
      fontSize: 10
    })
    card.addChild(buy)

    return { card, h: cardH }
  }

  function layMasonry(parent: any, cards: any[], heights: number[], startY: number, baseX: number, gap: number, cols: number, cw: number) {
    const colH = Array(cols).fill(startY)
    cards.forEach((cd, idx) => {
      const c = colH.indexOf(Math.min(...colH))
      cd.x = baseX + c * (cw + gap)
      cd.y = colH[c]
      parent.addChild(cd)
      colH[c] += heights[idx] + gap
    })
    return Math.max(...colH)
  }

  // CHARACTERS masonry
  const charHead = Text({
    text: 'Characters',
    style: { fontFamily: 'Arial', fontSize: 14, fill: 0x88ffaa }
  })
  charHead.x = 0
  charHead.y = curY
  content.addChild(charHead)
  curY += 22

  const charItems = CHAR_LIST.map((cid, i) => {
    const price = 15 + (i % 3) * 5
    const seller = SELLERS[i % SELLERS.length]
    return createListingCard({ id: cid, name: cid, price, seller }, true, () => doBuy(`char:${cid}`, price))
  })
  curY = layMasonry(content, charItems.map(x => x.card), charItems.map(x => x.h), curY, 0, GAP, COLS, cardW)

  curY += 18

  // ITEMS masonry
  const itemHead = Text({
    text: 'Items & Boosters',
    style: { fontFamily: 'Arial', fontSize: 14, fill: 0x88aaff }
  })
  itemHead.x = 0
  itemHead.y = curY
  content.addChild(itemHead)
  curY += 22

  const itemItems = ITEM_LIST.map((it, i) => {
    const seller = SELLERS[(i + 3) % SELLERS.length]
    return createListingCard({ id: it.id, name: it.name, price: it.price, seller }, false, () => doBuy(`item:${it.id}`, it.price))
  })
  curY = layMasonry(content, itemItems.map(x => x.card), itemItems.map(x => x.h), curY, 0, GAP, COLS, cardW)

  // padding child to ensure ScrollBox sees full content height
  const pad = Graphics({
    draw: (g: any) => {
      g.beginFill(0x000000, 0)
      g.drawRect(0, 0, 10, 200)
    }
  })
  pad.y = curY
  content.addChild(pad)

  // scroll the masonry content
  const scrollH = 820
  const scroller = new ScrollBox({
    items: [content],
    width: BASE_WIDTH - MARGIN * 2,
    height: scrollH,
    background: 'none',
    disableDynamicRendering: true,
    type: 'vertical',
  })
  scroller.x = MARGIN
  scroller.y = 85
  container.addChild(scroller)

  // pinned footer labels (collection)
  const footBase = BASE_HEIGHT - 52
  const note = Text({
    text: 'Peruse the peddlers\' wares and procure a pet or parcel! (wondrous data from the realms + buyFromMarket)',
    style: { fontFamily: 'Arial', fontSize: 11, fill: 0x777788 }
  })
  note.x = 60
  note.y = footBase
  container.addChild(note)

  const ownedLabel = Text({
    text: `Your collection: 0 chars (e.g. none)`,
    style: { fontFamily: 'Arial', fontSize: 12, fill: 0x88ffaa }
  })
  ownedLabel.x = 60
  ownedLabel.y = footBase + 16
  container.addChild(ownedLabel)

  const purchasedLabel = Text({
    text: `Purchased items: 0 (e.g. none)`,
    style: { fontFamily: 'Arial', fontSize: 12, fill: 0x88aaff }
  })
  purchasedLabel.x = 60
  purchasedLabel.y = footBase + 32
  container.addChild(purchasedLabel)

  // Subscriptions for live collection (chars from owned, items from purchases)
  try {
    const ownedCursor = getTree().select('ownedCharacters')
    onUpdate(ownedCursor, (owned: any) => {
      const count = Object.keys(owned || {}).length
      const sample = Object.values(owned || {}).slice(0, 3).map((c: any) => c && c.id).join(', ') || 'none'
      ownedLabel.text = `Your collection: ${count} chars (e.g. ${sample})`
    }, true)
    const purchCursor = getTree().select('events').select('purchases')
    onUpdate(purchCursor, (purch: any[]) => {
      const count = (purch || []).length
      const names = (purch || []).slice(-3).map((p: any) => (p.itemId || '').replace('item:', '')).join(', ') || 'none'
      purchasedLabel.text = `Purchased items: ${count} (e.g. ${names})`
    }, true)
  } catch {}

  async function doBuy(itemId: string, cost: number) {
    collectData('marketplace_buy', { itemId, cost })
    try {
      await callApi('buyFromMarket', { itemId, cost } as any)
      // gems, owned, purchases will update via onUpdate subs
    } catch (e) {
      console.warn('market buy failed', e)
    }
  }

  return container
}

// Back compat if needed
export function createMarketplaceScene(): PixiContainer {
  return MarketplaceScene()
}
