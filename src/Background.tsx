import React from "react"
import styled from "styled-components"
import CaveMp4 from './assets/cave_main_1.mp4'
import CaveJpg from './assets/cave_main_1.jpg'

const Video = styled.video.attrs({ autoPlay: true, muted: true, loop: true })`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
`

export default function Background(): JSX.Element {
    return <Video>
        <source src={CaveMp4} type="video/mp4" />
        <img src={CaveJpg} />
        {/* TODO: make image display until video loads */}
    </Video>
}
