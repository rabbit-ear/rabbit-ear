export { wedgeDef as default };
declare namespace wedgeDef {
    namespace wedge {
        export { str_path as nodeName };
        export { wedgeArguments as args };
        export let attributes: string[];
        export let methods: {
            clearTransform: (el: any) => any;
            setArc: (el: any, ...args: any[]) => any;
        };
    }
}
import { str_path } from '../../../environment/strings.js';
/**
 * Rabbit Ear (c) Kraft
 */
declare function wedgeArguments(a: any, b: any, c: any, d: any, e: any): string[];
