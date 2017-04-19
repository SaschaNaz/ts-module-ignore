export function A() {
}

export interface A {
}

export namespace A {

}

export class B {
}

export var C: any;
export let D: any;
export const E = 3;

export default E;

`
export
export const // TODO: this shouldn't be peeled
export default // TODO: this shouldn't be peeled
`