/**
 * Get index of next sibling in jQuery object, with circular traversal
 *
 * Based on https://github.com/w3c/aria-practices/blob/apg_1.2_wd2_candidate_1/examples/accordion/js/accordion.js#L81-L84.
 *
 * Parameters:
 * - '$collection': jQuery object containing elements to traverse
 * - '$current': jQuery object whose first element should anchor the traversal
 * - 'reverse': Boolean to get index of previous sibling instead
 */

export default ($collection, $current, reverse = false) => {
  const currentIndex = $collection.index($current);
  const direction = reverse ? -1 : 1;
  const { length } = $collection;
  const siblingIndex = (currentIndex + length + direction) % length;

  return siblingIndex;
};
