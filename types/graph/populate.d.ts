export default populate;
/**
 * @description Take a FOLD graph, containing any number of component fields,
 * and build and set as many missing component arrays as possible.
 * This method is not destructive, rather, it simply builds component arrays
 * if they do not already exist and if it's possible to be built without
 * making any assumptions. If your graph contains errors, this method will not
 * find them and will not correct them.
 * Regarding faces, this method is capable of walking and building faces
 * from scratch for FOLD objects which are creasePattern, not foldedForm,
 * but, the user needs to explicitly request this.
 * @param {FOLD} graph a FOLD object, modified in place
 * @param {object} options object, with the ability to request that the
 * faces be rebuilt by walking 2D planar faces, specify { "faces": true }.
 * @return {FOLD} graph the same input graph object
 */
declare function populate(graph: FOLD, options?: object): FOLD;
