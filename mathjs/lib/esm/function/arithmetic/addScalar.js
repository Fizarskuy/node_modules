import { factory } from '../../utils/factory.js';
import { addNumber } from '../../plain/number/index.js';
var name = 'addScalar';
var dependencies = ['typed'];
export var createAddScalar = /* #__PURE__ */factory(name, dependencies, _ref => {
  var {
    typed
  } = _ref;

  /**
   * Add two scalar values, `x + y`.
   * This function is meant for internal use: it is used by the public function
   * `add`
   *
   * This function does not support collections (Array or Matrix).
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit} x   First value to add
   * @param  {number | BigNumber | Fraction | Complex} y          Second value to add
   * @return {number | BigNumber | Fraction | Complex | Unit}     Sum of `x` and `y`
   * @private
   */
  return typed(name, {
    'number, number': addNumber,
    'Complex, Complex': function ComplexComplex(x, y) {
      return x.add(y);
    },
    'BigNumber, BigNumber': function BigNumberBigNumber(x, y) {
      return x.plus(y);
    },
    'Fraction, Fraction': function FractionFraction(x, y) {
      return x.add(y);
    },
    'Unit, Unit': function UnitUnit(x, y) {
      if (x.value === null || x.value === undefined) throw new Error('Parameter x contains a unit with undefined value');
      if (y.value === null || y.value === undefined) throw new Error('Parameter y contains a unit with undefined value');
      if (!x.equalBase(y)) throw new Error('Units do not match');
      var res = x.clone();
      res.value = this(res.value, y.value);
      res.fixPrefix = false;
      return res;
    }
  });
});