const layer_encode_convert = { 0:0, 1:1, 2:-1 };
/**
 * @description convert a layer-encoding (above/below) object
 * from 1,2 to 1,-1.
 * This modifies the input parameter in place.
 * @param {object} values are either 0, 1, 2.
 * @returns {object} values are either 0, 1, -1.
 */
export const unsigned_to_signed_layers = (conditions) => {
  Object.keys(conditions).forEach(key => {
    conditions[key] = layer_encode_convert[conditions[key]];
  });
};
