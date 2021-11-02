import type { Blessing, BlessingName } from '@shared'

export const blessingsMap: Record<BlessingName, Blessing> = {
    'amulet': { name: 'amulet', effect: 'double your damage' },
    'charm': { name: 'charm', effect: 'double your turns' },
}
