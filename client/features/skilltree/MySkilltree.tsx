import { SkillProvider, SkillTree, SkillTreeGroup } from 'beautiful-skill-tree'
import { h } from 'preact'

import { data } from './data'

export default function MySkilltree(): JSX.Element {
    return (
        <SkillProvider>
            <SkillTreeGroup>
                {({ skillCount }) => (
                    <SkillTree
                        treeId="first-tree"
                        title="Skill Tree"
                        data={data}
                        collapsible
                        description="My first skill tree"
                    />
                )}
            </SkillTreeGroup>
        </SkillProvider>
    )
}
