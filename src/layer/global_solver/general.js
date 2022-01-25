const to_signed_layer_convert = { 0:0, 1:1, 2:-1 };
const to_unsigned_layer_convert = { 0:0, 1:1, "-1":2 };
/**
 * @description convert a layer-encoding (above/below) object
 * from 1,2 to 1,-1.
 * The input parameter is MODIFIED IN PLACE!
 * @param {object} values are either 0, 1, 2.
 * @returns {object} values are either 0, 1, -1.
 */
export const unsigned_to_signed_conditions = (conditions) => {
  Object.keys(conditions).forEach(key => {
    conditions[key] = to_signed_layer_convert[conditions[key]];
  });
  return conditions;
};

export const signed_to_unsigned_conditions = (conditions) => {
  Object.keys(conditions).forEach(key => {
    conditions[key] = to_unsigned_layer_convert[conditions[key]];
  });
  return conditions;
};
