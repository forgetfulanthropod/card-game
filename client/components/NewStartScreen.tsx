import { useState, useEffect } from 'preact/hooks'
import { PrimaryButton } from './StartScreen'

export function NewStartScreen(props: {
    onEnter: (username: string) => void
}): JSXElement {
    return <div
        className='border-2 grid grid-rows-4 absolute left-0 w-full h-full pointer-events-auto'
    >
        <video
            src='./assets/backgrounds/main_menu_shed_bg.webm'
            autoPlay
            loop
            className='max-w-full absolute -z-50'
        />

        <div className='nav w-full border-2 border-red-500 row-span-1 flex p-4 justify-between'>
            <div className='border flex w-1/6 p-4'>
                <img className='' src='./logos/NewKaijuLogo.png' />
            </div>
            <div className='border flex items-center'>
                <PrimaryButton text='sign in' type='primary' size='small'/>
            </div>
        </div>

        <div className='bottom h-full row-span-3 grid grid-cols-12'>
            <div className='left-buttons h-full border-2 col-span-4 flex flex-col justify-end gap-8 p-8'>
                <PrimaryButton
                    text='tutorial'
                    onClick={() =>
                        props.onEnter('random-' + Math.random().toString())
                    }
                    type='secondary'
                    size='large'
                    />
                <PrimaryButton
                    text='play now'
                    onClick={() =>
                        props.onEnter('random-' + Math.random().toString())
                    }
                    type='primary'
                    size='large'
                    />
            </div>
            <div className='mid-buttons h-full border-2 col-span-4'></div>
            <div className='right-buttons h-full border-2 col-span-4'></div>
        </div>
    </div>
}
