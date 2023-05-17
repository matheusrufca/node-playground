
export const toJson = (data: any) => JSON.stringify(data, null, 2)

export const parseJson = (value: string) => JSON.parse(value)