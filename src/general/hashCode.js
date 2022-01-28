/**
 * @description a javascript re-implementation of Java's .hashCode()
 * https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
 */
const hashCode = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = ((hash << 5) - hash) + string.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

export default hashCode;
