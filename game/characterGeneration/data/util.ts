export const randomInteger = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const rollNumber = (): number => {
  return randomInteger(1, 10000)
}

export const randomValue = (list: Array<any>): any => {
  const idx = randomInteger(0, list.length - 1)
  return list[idx]
}

export const rollWeights = (pdfMap: Record<string, number>) => {
  const roll = rollNumber()
  for (const [value, weight] of Object.entries(pdfMap)) {
    if (roll <= weight) return value
  }
  return -1
}

export const makeCDF = (weights: Record<string, number>) => {
  let weight = 0
  const cdf = Object.fromEntries(
    Object.entries(weights).map(([k, v]) => {
      weight += v * 10000
      return [k, weight]
    })
  )
  return cdf
}
