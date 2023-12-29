/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  const getArea = () => {
    return width * height;
  };

  return { width, height, getArea };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const parseJson = JSON.parse(json);
  return Object.setPrototypeOf(parseJson, proto);
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Selector {
  orderNumber;
  value;
  name;

  constructor(value) {
    this.value = value;
  }

  toString() {}
}

class ElementSelector extends Selector {
  orderNumber = 1;
  name = 'element';

  constructor(value) {
    super(value);
  }

  toString() {
    return this.value;
  }
}

class IdSelector extends Selector {
  orderNumber = 2;
  name = 'id';

  constructor(value) {
    super(value);
  }

  toString() {
    return `#${this.value}`;
  }
}

class ClassSelector extends Selector {
  orderNumber = 3;
  name = 'class';

  constructor(value) {
    super(value);
  }

  toString() {
    return `.${this.value}`;
  }
}

class AttrSelector extends Selector {
  orderNumber = 4;
  name = 'attr';

  constructor(value) {
    super(value);
  }

  toString() {
    return `[${this.value}]`;
  }
}

class PseudoClassSelector extends Selector {
  orderNumber = 5;
  name = 'pseudoClass';

  constructor(value) {
    super(value);
  }

  toString() {
    return `:${this.value}`;
  }
}

class PseudoElementSelector extends Selector {
  orderNumber = 6;
  name = 'pseudoElement';

  constructor(value) {
    super(value);
  }

  toString() {
    return `::${this.value}`;
  }
}

class SelectorBuilder {
  selectors;
  singleSelectorsObjectCount;

  constructor() {
    this.selectors = [];
    this.singleSelectorsObjectCount = {
      element: 0,
      id: 0,
      pseudoElement: 0,
    };
  }

  addSelector(selector, isSingle) {
    this.selectors.push(selector);
    this.validateSelectorsOrder();

    if (isSingle) {
      this.validateSelectorCount(selector.name);
    }
  }


  stringify() {
    return this.selectors.map((selector) => selector.toString()).join('');
  }

  element(value) {
    this.addSelector(new ElementSelector(value), true);
    return this;
  }

  id(value) {
    this.addSelector(new IdSelector(value), true);
    return this;
  }

  class(value) {
    this.addSelector(new ClassSelector(value));
    return this;
  }

  attr(value) {
    this.addSelector(new AttrSelector(value));
    return this;
  }

  pseudoClass(value) {
    this.addSelector(new PseudoClassSelector(value));
    return this;
  }

  pseudoElement(value) {
    this.addSelector(new PseudoElementSelector(value), true);
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.selectors.push(
      selector1.stringify() + ` ${combinator} ` + selector2.stringify()
    );
    return this;
  }

  validateSelectorCount(selectorName) {
    this.singleSelectorsObjectCount[selectorName] += 1;
    const selectorCountByName = this.singleSelectorsObjectCount[selectorName];

    if (selectorCountByName && selectorCountByName > 1)
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector'
      );
  }

  validateSelectorsOrder() {
    for (var i = 0; i < this.selectors.length; i++) {
      const currentSelectorNumber = this.selectors[i].orderNumber;
      const nextSelectorNumber = this.selectors[i + 1]?.orderNumber;

      if (nextSelectorNumber) {
        if (currentSelectorNumber > nextSelectorNumber) {
          throw new Error(
            'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'
          );
        }
      }
    }
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new SelectorBuilder().element(value);
  },

  id(value) {
    return new SelectorBuilder().id(value);
  },

  class(value) {
    return new SelectorBuilder().class(value);
  },

  attr(value) {
    return new SelectorBuilder().attr(value);
  },

  pseudoClass(value) {
    return new SelectorBuilder().pseudoClass(value);
  },

  pseudoElement(value) {
    return new SelectorBuilder().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new SelectorBuilder().combine(selector1, combinator, selector2);
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
