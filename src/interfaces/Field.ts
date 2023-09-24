export type IFieldProp = 'start' | 'finish' | 'wall' | 'searched' | 'path' | 'grass' | 'snow' | 'sand' | 'water'

// intersection type combines the IFieldProps with the additional props that are not booleans
export type IField = { [key in IFieldProp]: boolean } & { id: number, weight: number, x: number, y: number }