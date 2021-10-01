// HealthBar.stories.ts | HealthBar.stories.tsx

import { ComponentStory, Meta } from '@storybook/react'
import React from 'react'
import HealthBar from '../components/HealthBar'



export default {
    component: HealthBar,
    title: 'Components/HealthBar',
    argTypes: {
        value: {
            control: {
                type: 'range',
                min: 1,
                max: 100,
            }
        }
    }
} as Meta
const Template: ComponentStory<typeof HealthBar> = (args) => <HealthBar {...args} />


export const Max = Template.bind({});
Max.args = {
    value: 100,
    max: 100
};
export const Min = Template.bind({});
Min.args = {
    value: 1,
    max: 100
};

export const Half = Template.bind({});
Half.args = {
    value: 50,
    max: 100
};

// export const Mid: React.VFC<typeof HealthBar> = () => <HealthBar value={70} max={100} />
// export const Low: React.VFC<typeof HealthBar> = () => <HealthBar value={20} max={100} />
