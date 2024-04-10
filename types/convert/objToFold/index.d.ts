export default objToFold;
/**
 * @description Convert an OBJ mesh file into a FOLD object. The conversion
 * will create edge definitions and give them assignments and fold angles
 * depending on the dihedral angles, or boundary edges
 * if only one face is adjacent.
 * @param {string} file a string containing the contents of an OBJ file,
 * expected to contain at least vertices and faces. All groups or object
 * separations are currently ignored, the contents are treated as one object.
 * @returns {FOLD} a FOLD representation of the OBJ file
 */
declare function objToFold(file: string): FOLD;
