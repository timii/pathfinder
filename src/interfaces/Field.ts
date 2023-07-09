// export interface IField {
//     [start: string]: boolean;
//     [finish: string]: boolean;
//     wall: boolean;
//     walkedOver: boolean;
// }
export type IFieldProp = 'start' | 'finish' | 'wall' | 'walkedOver'

export type IField = { [key in IFieldProp]: boolean }