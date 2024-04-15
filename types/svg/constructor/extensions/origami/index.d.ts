export { origamiDef as default };
declare namespace origamiDef {
    namespace origami {
        export let nodeName: string;
        export { init };
        export function args(): any[];
        export { methods };
    }
}
import init from './init.js';
import methods from './methods.js';
