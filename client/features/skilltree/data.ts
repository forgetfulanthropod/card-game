import type { SkillType } from 'beautiful-skill-tree'

export const data: SkillType[] = [
    {
        id: '#af7c18',
        title: 'Start learning',
        tooltip: {
            content: 'Start building your skills in kaiju cards',
        },
        children: [
            {
                id: 'gather',
                title: 'gather',
                tooltip: {
                    content: 'Start learning how to gather',
                },
                children: [
                    {
                        id: 'gather',
                        title: 'gather',
                        tooltip: {
                            content:
                                'Start learning how to gather items in the world',
                        },
                        children: [
                            {
                                id: 'mine',
                                title: 'mine',
                                tooltip: {
                                    content:
                                        'Begin the journey to mining copper, iron, and steel',
                                },
                                children: [],
                            },
                            {
                                id: 'fish',
                                title: 'fish',
                                tooltip: {
                                    content: 'Just fishin fish',
                                },
                                children: [],
                            },
                        ],
                    },
                ],
            },
            {
                id: 'crafting',
                title: 'crafting',
                tooltip: {
                    content: 'can you craft it?',
                },
                children: [
                    {
                        id: 'enchantments',
                        title: 'enchantments',
                        tooltip: {
                            content: 'make your items magical',
                        },
                        children: [],
                    },
                    {
                        id: 'weapons',
                        title: 'weapons',
                        tooltip: {
                            content: 'fare better in PvE and PvP',
                        },
                        children: [],
                    },
                    {
                        id: 'gathertools',
                        title: 'gathertools',
                        tooltip: {
                            content: 'be more efficient in your gathering',
                        },
                        children: [],
                    },
                ],
            },
        ],
    },
]
