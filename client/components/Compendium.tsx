import { useEffect, useState } from 'react'
import { callApi } from '@/callApi'
import { UserID } from 'shared'

type CompendiumData = {
  cards: string[]
  souvenirs: string[]
  swords: string[]
}

const ALL_CARDS = ['leadRazor', 'shieldOfHolyLight', 'attack', 'shield', 'magicAttack', 'chainLightning'] // extend with real from cardDefinitionsMap
const ALL_SOUVENIRS = ['bigStinkyTooth', 'dentistryForDummies', 'frogWine', 'equippableExample']
const ALL_SWORDS = ['normal', 'dirt', 'wood', 'iron', 'jade', 'fire'] // swordPartIds + composed

export function Compendium({ userId, setShow }: { userId: UserID; setShow: (v: boolean) => void }) {
  const [data, setData] = useState<CompendiumData>({ cards: [], souvenirs: [], swords: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    callApi('getCompendium', { userId } as any).then((res: any) => {
      if (res) setData(res)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [userId])

  const isDiscovered = (cat: 'cards' | 'souvenirs' | 'swords', id: string) =>
    (data as any)[cat]?.includes(id)

  const renderList = (title: string, all: string[], cat: 'cards' | 'souvenirs' | 'swords') => (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2 text-white/90">{title}</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {all.map(id => {
          const discovered = isDiscovered(cat, id)
          return (
            <div
              key={id}
              className={`p-2 rounded border ${discovered ? 'bg-[#2a2744] border-[#5a4a8a] text-white' : 'bg-stone-800/60 border-stone-700 text-stone-400 italic'}`}
            >
              {discovered ? id : `??? (${id})`}
              {discovered && <span className="ml-1 text-[10px] opacity-60">✓</span>}
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80" onClick={() => setShow(false)}>
      <div className="bg-[#1f1e3a] text-white p-6 rounded-xl max-w-lg w-full mx-3 max-h-[85vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bigFont uppercase mb-4 text-center">Compendium</h2>
        <p className="text-center text-xs opacity-60 mb-4">Discovered items from your runs. Undiscovered are grayed out.</p>

        {loading ? <div className="text-center py-8">Loading...</div> : (
          <>
            {renderList('Cards', ALL_CARDS, 'cards')}
            {renderList('Souvenirs & Equippables', ALL_SOUVENIRS, 'souvenirs')}
            {renderList('Swords / Sword Parts', ALL_SWORDS, 'swords')}
          </>
        )}

        <button onClick={() => setShow(false)} className="mt-4 w-full py-2 bg-[#5a4a8a] rounded text-sm">Close</button>
        <div className="text-[10px] opacity-40 mt-2 text-center">Play more runs (even poorly) to discover more.</div>
      </div>
    </div>
  )
}
