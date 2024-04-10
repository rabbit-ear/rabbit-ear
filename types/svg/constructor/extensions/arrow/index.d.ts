export { arrowDef as default };
declare namespace arrowDef {
    namespace arrow {
        export let nodeName: string;
        export let attributes: any[];
        export function args(): any[];
        export { ArrowMethods as methods };
        export { init };
    }
}
import ArrowMethods from './methods.js';
import init from './init.js';
