/*
 * sfChoiceFormat class file.
 *
 * <code>
 *  var string = '[0] are no files |[1] is one file |(1,Inf] are {number} files';
 *  
 *  var choice = new sfChoiceFormat();
 *  document.write choice.format(string, 0); //shows "are no files"
 * </code>
 *
 * @version    1 2012-07-09 08:08:59Z toaotc
*/
/*
 * sfChoiceFormat class file.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the BSD License.
 *
 * Copyright(c) 2004 by Qiang Xue. All rights reserved.
 *
 * To contact the author write to {@link mailto:qiang.xue@gmail.com Qiang Xue}
 * The latest version of PRADO can be obtained from:
 * {@link http://prado.sourceforge.net/}
 *
 * @author     Wei Zhuo <weizhuo[at]gmail[dot]com>
 * @version    $Id: sfChoiceFormat.class.php 33251 2011-12-12 16:30:59Z fabien $
 * @package    symfony
 * @subpackage i18n
*/
/*
 * sfChoiceFormat class.
 * 
 * sfChoiceFormat converts between ranges of numeric values and string 
 * names for those ranges.
 *
 * A sfChoiceFormat splits the real number line -Inf to +Inf into two or 
 * more contiguous ranges. Each range is mapped to a string. 
 * sfChoiceFormat is generally used in a MessageFormat for displaying 
 * grammatically correct plurals such as "There are 2 files."
 *
 * <code>
 *  $string = '[0] are no files |[1] is one file |(1,Inf] are {number} files';
 *  
 *  $formatter = new sfMessageFormat(...); //init for a source
 *  $translated = $formatter->format($string);
 *
 *  $choice = new sfChoiceFormat();
 *  echo $choice->format($translated, 0); //shows "are no files"
 * </code>
 *
 * The message/string choices are separated by the pipe "|" followed
 * by a set notation of the form
 *  # <t>[1,2]</t> -- accepts values between 1 and 2, inclusive.
 *  # <t>(1,2)</t> -- accepts values between 1 and 2, excluding 1 and 2.
 *  # <t>{1,2,3,4}</t> -- only values defined in the set are accepted.
 *  # <t>[-Inf,0)</t> -- accepts value greater or equal to negative infinity 
 *                       and strictly less than 0
 * Any non-empty combinations of the delimiters of square and round brackets
 * are acceptable.
 *
 * @author Xiang Wei Zhuo <weizhuo[at]gmail[dot]com>
 * @version v1.0, last update on Fri Dec 24 20:46:16 EST 2004
 * @package    symfony
 * @subpackage i18n
*/
var sfChoiceFormat,
  __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

sfChoiceFormat = (function() {
  var parsePattern, validatePattern;

  parsePattern = /(?:^\s*|\s*\|)([\(\[\{]([-Inf\d:\s]+,?[\+Inf\d\s:\?\-=!><%\|&\(\)]*)+[\)\]\}])\s*/g;

  validatePattern = /[\(\[\{]|[-Inf\d:\s]+|,|[\+Inf\d\s:\?\-=!><%\|&\(\)]+|[\)\]\}]/gm;

  function sfChoiceFormat() {
    this.inf = -Math.log(0);
  }

  sfChoiceFormat.prototype.isValid = function(number, set) {
    var elements, i, left, leftBracket, matches, n, right, rightBracket, str, subset, total, _len, _ref;
    matches = (_ref = set.match(validatePattern)) != null ? _ref : [];
    n = matches.length;
    if (n < 3) throw 'Invalid set ' + set + '.';
    if (subset = set.match(/\{\s*n:([^\}]+)\}/)) {
      return this.isValidSetNotation(number, subset[1]);
    }
    leftBracket = matches[0];
    rightBracket = matches[n - 1];
    elements = [];
    for (i = 0, _len = matches.length; i < _len; i++) {
      str = matches[i];
      if (i !== 0 && i !== n - 1 && str !== ',') {
        elements.push((str === '-Inf' ? this.inf * -1 : str === '+Inf' || str === 'Inf' ? this.inf : Number(str)));
      }
    }
    total = elements.length;
    number = Number(number);
    if (leftBracket === '{' && rightBracket === '}') {
      return __indexOf.call(elements, number) >= 0;
    }
    left = leftBracket === '[' ? number >= elements[0] : leftBracket === '(' ? number > elements[0] : false;
    right = rightBracket === ']' ? number <= elements[total - 1] : rightBracket === ')' ? number < elements[total - 1] : false;
    return left && right;
  };

  sfChoiceFormat.prototype.isValidSetNotation = function(number, subset) {
    var str;
    str = subset.replace('n', number);
    return eval(str);
  };

  sfChoiceFormat.prototype.parse = function(string) {
    var j, matches, _i, _len, _ref, _results;
    matches = (_ref = string.split(parsePattern)) != null ? _ref : [];
    _results = [];
    for (_i = 0, _len = matches.length; _i < _len; _i++) {
      j = matches[_i];
      _results.push([_ref[_i + 1], _ref[(_i += 2) + 1]]);
    }
    return _results;
  };

  sfChoiceFormat.prototype.format = function(string, number) {
    var set, _i, _len, _ref;
    _ref = this.parse(string);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      set = _ref[_i];
      if (this.isValid(number, set[0])) return set[1];
    }
    return false;
  };

  return sfChoiceFormat;

})();
