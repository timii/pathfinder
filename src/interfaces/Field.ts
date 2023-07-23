// export interface IField {
//     [start: string]: boolean;
//     [finish: string]: boolean;
//     wall: boolean;
//     searched: boolean;
// }
export type IFieldProp = 'start' | 'finish' | 'wall' | 'searched' | 'path'

export type IField = { [key in IFieldProp]: boolean }