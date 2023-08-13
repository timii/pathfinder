// export interface IField {
//     [start: string]: boolean;
//     [finish: string]: boolean;
//     wall: boolean;
//     searched: boolean;
// }
export type IFieldProp = 'start' | 'finish' | 'wall' | 'searched' | 'path' | 'grass'

// intersection type combines the IFieldProps with the additional id 
export type IField = { [key in IFieldProp]: boolean } & { id: number }