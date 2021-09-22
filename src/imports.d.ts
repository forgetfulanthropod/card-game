declare module "*.png" {
    const path: string
    export default path
}

declare module "*.mp4" {
    const path: string
    export default path
}

declare module "*.module.css" {
    const classes: { readonly [key: string]: string }
    export default classes
}
