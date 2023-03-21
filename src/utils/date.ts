export const now = (): Date => new Date()

export const getTimestamp = (): number => new Date().getTime()

export default { now, getTimestamp }