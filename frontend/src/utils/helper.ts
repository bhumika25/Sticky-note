// Recursively traverse the tree to find the path to selected node
import {Node} from '../types'
const getBreadcrumbPath = (node: Node, targetId: number): Node[] | null => {
  if (node.id === targetId) {
    return [node];
  }

  if (node.children) {
    for (const child of node.children) {
      const childPath = getBreadcrumbPath(child, targetId);
      if (childPath) {
        return [node, ...childPath]; // prepend current node
      }
    }
  }

  return null;
};

export default getBreadcrumbPath;