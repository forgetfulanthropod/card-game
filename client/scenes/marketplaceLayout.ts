// Pure layout computation for the whimsical marketplace.
// Returns absolute positions for fixed header/footer and relative positions
// for the scrollable list content (section headers + stall/booth rows).
// The list content uses relative Y starting at 0; caller places it inside ScrollBox.

export interface MarketplaceLayout {
  headerBottom: number
  footerTop: number
  footerYs: {
    note: number
    owned: number
    purchased: number
  }
  // relative to top of list content (inside scroll pane)
  stallHeaderY: number
  stallRowYs: number[]
  boothHeaderY: number
  boothRowYs: number[]
}

export function computeMarketplaceLayout(
  charCount: number,
  itemCount: number,
  baseHeight: number = 1080
): MarketplaceLayout {
  const HEADER_BOTTOM = 100
  const SCROLL_END = baseHeight - 100   // viewport ends here; footer band below
  const FOOTER_TOP = SCROLL_END

  const ROW_H = 58
  const TITLE_H = 25
  const TITLE_GAP = 10

  // relative positions start at 0 for list content top
  let rel = 0

  const stallHeaderY = rel
  rel += TITLE_H + TITLE_GAP

  const stallRowYs: number[] = []
  for (let i = 0; i < charCount; i++) {
    stallRowYs.push(rel)
    rel += ROW_H
  }

  const boothHeaderY = rel + 5
  rel += TITLE_H + TITLE_GAP

  const boothRowYs: number[] = []
  for (let i = 0; i < itemCount; i++) {
    boothRowYs.push(rel)
    rel += ROW_H
  }

  // footer pinned, starting just after scroll viewport
  const footerYs = {
    note: FOOTER_TOP + 5,
    owned: FOOTER_TOP + 25,
    purchased: FOOTER_TOP + 45,
  }

  return {
    headerBottom: HEADER_BOTTOM,
    footerTop: FOOTER_TOP,
    footerYs,
    stallHeaderY,
    stallRowYs,
    boothHeaderY,
    boothRowYs,
  }
}
