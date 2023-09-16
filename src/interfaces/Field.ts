// export interface IField {
//     [start: string]: boolean;
//     [finish: string]: boolean;
//     wall: boolean;
//     searched: boolean;
// }
export type IFieldProp = 'start' | 'finish' | 'wall' | 'searched' | 'path' | 'grass' | 'snow' | 'sand' | 'water'

// intersection type combines the IFieldProps with the additional id 
export type IField = { [key in IFieldProp]: boolean } & { id: number, weight: number, x: number, y: number }