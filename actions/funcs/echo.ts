export default function echo<T extends { [x: string]: never }>(args: T): T { return args }
