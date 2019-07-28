(function() {
'use strict';
/**
 * Create html element
 * @param {String} type html element 
 * @param {Object} config
 */
function  createElement(type, config) {
  const htmlElement = document.createElement(type);

  if (config === undefined) {
    return htmlElement;
  }

  if (config.className) {
    htmlElement.className = config.className;
  }

  if (config.content) {
    htmlElement.textContent = config.content;
  }

  if (config.children) {
    config.children.forEach((el) => {
      if (el !== null) {
        htmlElement.appendChild(el);
      }
    });
  }

  return htmlElement; 
}


/**
 * @param {Object} node
 * @return {HTMLElement}
 */
function createExpandedElement(node) {
  const iElem = createElement('i');

  if (node.expanded) {
    iElem.className = 'fas fa-caret-down';
  } else {
    iElem.className = 'fas fa-caret-right';
  }

  const caretElem = createElement('div', {
    className: 'caret-icon',
    children: [iElem],
  });

  const handleClick = node.toggle.bind(node);
  caretElem.addEventListener('click', handleClick);

  const indexElem = createElement('div', {
    className: 'json-index',
    content: node.key,
  });

  const typeElem = createElement('div', {
    className: 'json-type',
    content: node.type,
  });

  const keyElem = createElement('div', {
    className: 'json-key',
    content: node.key,
  });

  const sizeElem = createElement('div', {
    className: 'json-size'
  });

  if (node.type === 'array') {
    sizeElem.innerText = '[' + node.children.length + ']';
  } else if (node.type === 'object') {
    sizeElem.innerText = '{' + node.children.length + '}';
  }

  let lineChildren;
  if (node.key === null) {
    lineChildren = [caretElem, typeElem, sizeElem]
  } else if (node.parent.type === 'array') {
    lineChildren = [caretElem, indexElem, sizeElem]
  } else {
    lineChildren = [caretElem, keyElem, sizeElem]
  }

  const lineElem = createElement('div', {
    className: 'line',
    children: lineChildren
  });

  if (node.depth > 0) {
    lineElem.style = 'margin-left: ' + node.depth * 24 + 'px;';
  }

  return lineElem;
}


/**
 * @param {Object} node
 * @return {HTMLElement}
 */
function createNotExpandedElement(node) {
  const caretElem = createElement('div', {
    className: 'empty-icon',
  });

  const keyElem = createElement('div', {
    className: 'json-key',
    content: node.key
  });

  const separatorElement = createElement('div', {
    className: 'json-separator',
    content: ':'
  });

  const valueType = ' json-' + typeof node.value;
  const valueContent = String(node.value);
  const valueElement = createElement('div', {
    className: 'json-value' + valueType,
    content: valueContent
  });

  const lineElem = createElement('div', {
    className: 'line',
    children: [caretElem, keyElem, separatorElement, valueElement]
  });

  if (node.depth > 0) {
    lineElem.style = 'margin-left: ' + node.depth * 24 + 'px;';
  }

  return lineElem;
}


/**
 * create tree node
 * @return {Object}
 */
function createNode() {
  return {
    key: null,
    parent: null,
    value: null,
    expanded: false,
    type: null,
    children: null,
    elem: null,
    depth: 0,

    setCaretIconRight() {
      const icon = this.elem.querySelector('.fas');
      icon.classList.replace('fa-caret-down', 'fa-caret-right');
    },

    setCaretIconDown() {
      const icon = this.elem.querySelector('.fas');
      icon.classList.replace('fa-caret-right', 'fa-caret-down');
    },

    hideChildren() {
      if (this.children !== null) {
        this.children.forEach((item) => {
          item.elem.classList.add('hide');
          if (item.expanded) {
            item.hideChildren();
          }
        });
      }
    },

    showChildren() {
      if (this.children !== null) {
        this.children.forEach((item) => {
          item.elem.classList.remove('hide');
          if (item.expanded) {
            item.showChildren();
          }
        });
      }
    },

    toggle: function() {
      if (this.expanded) {
        this.expanded = false;
        this.hideChildren();
        this.setCaretIconRight();
      } else {
        this.expanded = true;
        this.showChildren();
        this.setCaretIconDown();
      }
    }
  }
}


/**
 * Return object length
 * @param {Object} obj
 * @return {number}
 */
function getLength(obj) {
  let length = 0;
  for (let key in obj) {
    length += 1;
  };
  return length;
}


/**
 * Return variable type
 * @param {*} val
 */
function getType(val) {
  let type = typeof val;
  if (Array.isArray(val)) {
    type = 'array';
  } else if (val === null) {
    type = 'null';
  }
  return type;
}


/**
 * Recursively traverse json object
 * @param {Object} obj parsed json object
 * @param {Object} parent of object tree
 */
function traverseObject(obj, parent) {
  for (let key in obj) {
    const child = createNode();
    child.parent = parent;
    child.key = key;
    child.type = getType(obj[key]);
    child.depth = parent.depth + 1;
    child.expanded = false;

    if (typeof obj[key] === 'object') {
      child.children = [];
      parent.children.push(child);
      traverseObject(obj[key], child);
      child.elem = createExpandedElement(child);
    } else {
      child.value = obj[key];
      child.elem = createNotExpandedElement(child);
      parent.children.push(child);
    }
  }
}


/**
 * Create root of a tree
 * @param {Object} obj Json object
 * @return {Object}
 */
function createTree(obj) {
  const tree = createNode();
  tree.type = getType(obj);
  tree.children = [];
  tree.expanded = true;

  traverseObject(obj, tree);
  tree.elem = createExpandedElement(tree);

  return tree;
}


/**
 * Recursively traverse Tree object
 * @param {Object} node
 * @param {Callback} callback
 */
function traverseTree(node, callback) {
  callback(node);
  if (node.children !== null) {
    node.children.forEach((item) => {
      traverseTree(item, callback);
    });
  }
}


/**
 * Render Tree object
 * @param {Object} tree
 * @param {String} targetElem
 */
function render(tree, targetElem) {
  let rootElem;
  if (targetElem) {
    rootElem = document.querySelector(targetElem);
  } else {
    rootElem = document.body;
  }

  traverseTree(tree, (node) => {
    if (!node.expanded) {
      node.hideChildren();
    }
    rootElem.appendChild(node.elem);
  });
}


/* Export jsonView object */
window.jsonView = {
  /**
   * Render JSON into DOM container
   * @param {String} jsonData
   * @param {String} targetElem
   */
  format: function(jsonData, targetElem) {
    const parsedData = JSON.parse(jsonData);
    const tree = createTree(parsedData);
    render(tree, targetElem);
  }
}

})();
