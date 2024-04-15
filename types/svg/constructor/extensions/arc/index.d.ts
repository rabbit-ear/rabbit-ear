export { arcDef as default };
declare namespace arcDef {
    namespace arc {
        export { str_path as nodeName };
        export let attributes: string[];
        export { arcArguments as args };
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
declare function arcArguments(a: any, b: any, c: any, d: any, e: any): string[];
