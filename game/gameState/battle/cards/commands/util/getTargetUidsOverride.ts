import { BattleCursor, CharacterUid, Command } from 'shared'

export function getTargetUidsOverride({
    targetTypeOverride,
    scene,
    command,
    givenUids,
}: {
    targetTypeOverride: any
    scene: BattleCursor
    command: Command
    givenUids: CharacterUid[]
}) {
    if (targetTypeOverride == null) {
        return givenUids
    }

    if (['allFriends', 'allEnemies'].includes(targetTypeOverride)) {
        const ac = scene.get('allCharacters')
        const isPcSource = ac[command.characterUid].isPc
        const shouldBePc = isPcSource === (targetTypeOverride === 'allFriends') // NOR
        return Object.values(ac)
            .filter(x => x.isPc === shouldBePc)
            .map(x => x.uid)
    } else if (['self'].includes(targetTypeOverride)) {
        return [command.characterUid]
    } else {
        // TODO: random enemy and random friend
        return givenUids
    }
}
