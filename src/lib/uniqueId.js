/**
 * Generate unique ID under framework-specific namespace
 *
 * Based on https://github.com/jquery/jquery-ui/blob/1.12.1/ui/unique-id.js
 */

let idCount = 0;

export default () => {
  idCount += 1;

  return `itc-id-${idCount}`;
};
