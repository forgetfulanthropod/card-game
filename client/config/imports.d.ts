/* eslint-disable import/no-default-export */
/*
declare module '*.png' {
    const path: string
    export default path
}
declare module '*.webp' {
    const path: string
    export default path
}

declare module '*.svg' {
    const path: string
    export default path
}

declare module '*.jpg' {
    const path: string
    export default path
}

declare module '*.mp4' {
    const path: string
    export default path
}

declare module '*.webm' {
    const path: string
    export default path
}


declare module '*.ttf' {
    const path: string
    export default path
}

*/
declare module '*.module.css' {
    const classes: { readonly [key: string]: string }
    export default classes
}
