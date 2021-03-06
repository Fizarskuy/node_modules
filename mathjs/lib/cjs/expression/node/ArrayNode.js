"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createArrayNode = void 0;

var _is = require("../../utils/is.js");

var _array = require("../../utils/array.js");

var _factory = require("../../utils/factory.js");

var name = 'ArrayNode';
var dependencies = ['Node'];
var createArrayNode = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var Node = _ref.Node;

  /**
   * @constructor ArrayNode
   * @extends {Node}
   * Holds an 1-dimensional array with items
   * @param {Node[]} [items]   1 dimensional array with items
   */
  function ArrayNode(items) {
    if (!(this instanceof ArrayNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    this.items = items || []; // validate input

    if (!Array.isArray(this.items) || !this.items.every(_is.isNode)) {
      throw new TypeError('Array containing Nodes expected');
    }
  }

  ArrayNode.prototype = new Node();
  ArrayNode.prototype.type = 'ArrayNode';
  ArrayNode.prototype.isArrayNode = true;
  /**
   * Compile a node into a JavaScript function.
   * This basically pre-calculates as much as possible and only leaves open
   * calculations which depend on a dynamic scope with variables.
   * @param {Object} math     Math.js namespace with functions and constants.
   * @param {Object} argNames An object with argument names as key and `true`
   *                          as value. Used in the SymbolNode to optimize
   *                          for arguments from user assigned functions
   *                          (see FunctionAssignmentNode) or special symbols
   *                          like `end` (see IndexNode).
   * @return {function} Returns a function which can be called like:
   *                        evalNode(scope: Object, args: Object, context: *)
   */

  ArrayNode.prototype._compile = function (math, argNames) {
    var evalItems = (0, _array.map)(this.items, function (item) {
      return item._compile(math, argNames);
    });
    var asMatrix = math.config.matrix !== 'Array';

    if (asMatrix) {
      var matrix = math.matrix;
      return function evalArrayNode(scope, args, context) {
        return matrix((0, _array.map)(evalItems, function (evalItem) {
          return evalItem(scope, args, context);
        }));
      };
    } else {
      return function evalArrayNode(scope, args, context) {
        return (0, _array.map)(evalItems, function (evalItem) {
          return evalItem(scope, args, context);
        });
      };
    }
  };
  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */


  ArrayNode.prototype.forEach = function (callback) {
    for (var i = 0; i < this.items.length; i++) {
      var node = this.items[i];
      callback(node, 'items[' + i + ']', this);
    }
  };
  /**
   * Create a new ArrayNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {ArrayNode} Returns a transformed copy of the node
   */


  ArrayNode.prototype.map = function (callback) {
    var items = [];

    for (var i = 0; i < this.items.length; i++) {
      items[i] = this._ifNode(callback(this.items[i], 'items[' + i + ']', this));
    }

    return new ArrayNode(items);
  };
  /**
   * Create a clone of this node, a shallow copy
   * @return {ArrayNode}
   */


  ArrayNode.prototype.clone = function () {
    return new ArrayNode(this.items.slice(0));
  };
  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   * @override
   */


  ArrayNode.prototype._toString = function (options) {
    var items = this.items.map(function (node) {
      return node.toString(options);
    });
    return '[' + items.join(', ') + ']';
  };
  /**
   * Get a JSON representation of the node
   * @returns {Object}
   */


  ArrayNode.prototype.toJSON = function () {
    return {
      mathjs: 'ArrayNode',
      items: this.items
    };
  };
  /**
   * Instantiate an ArrayNode from its JSON representation
   * @param {Object} json  An object structured like
   *                       `{"mathjs": "ArrayNode", items: [...]}`,
   *                       where mathjs is optional
   * @returns {ArrayNode}
   */


  ArrayNode.fromJSON = function (json) {
    return new ArrayNode(json.items);
  };
  /**
   * Get HTML representation
   * @param {Object} options
   * @return {string} str
   * @override
   */


  ArrayNode.prototype.toHTML = function (options) {
    var items = this.items.map(function (node) {
      return node.toHTML(options);
    });
    return '<span class="math-parenthesis math-square-parenthesis">[</span>' + items.join('<span class="math-separator">,</span>') + '<span class="math-parenthesis math-square-parenthesis">]</span>';
  };
  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */


  ArrayNode.prototype._toTex = function (options) {
    function itemsToTex(items, nested) {
      var mixedItems = items.some(_is.isArrayNode) && !items.every(_is.isArrayNode);
      var itemsFormRow = nested || mixedItems;
      var itemSep = itemsFormRow ? '&' : '\\\\';
      var itemsTex = items.map(function (node) {
        if (node.items) {
          return itemsToTex(node.items, !nested);
        } else {
          return node.toTex(options);
        }
      }).join(itemSep);
      return mixedItems || !itemsFormRow || itemsFormRow && !nested ? '\\begin{bmatrix}' + itemsTex + '\\end{bmatrix}' : itemsTex;
    }

    return itemsToTex(this.items, false);
  };

  return ArrayNode;
}, {
  isClass: true,
  isNode: true
});
exports.createArrayNode = createArrayNode;