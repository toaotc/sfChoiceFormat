###
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
###


###
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
###


###
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
 ###


class sfChoiceFormat
    parsePattern = /(?:^\s*|\s*\|)([\(\[\{]([-Inf\d:\s]+,?[\+Inf\d\s:\?\-=!><%\|&\(\)]*)+[\)\]\}])\s*/g
    validatePattern = /[\(\[\{]|[-Inf\d:\s]+|,|[\+Inf\d\s:\?\-=!><%\|&\(\)]+|[\)\]\}]/gm
    
    constructor: () ->
        @inf = -Math.log(0)
    
    isValid: (number, set) ->
        matches = (set.match validatePattern) ? []
        n = matches.length
        
        throw 'Invalid set ' + set + '.' if n < 3
        return @isValidSetNotation number, subset[1] if subset = set.match /\{\s*n:([^\}]+)\}/
        
        leftBracket = matches[0]
        rightBracket = matches[n-1]
        
        elements = []
        elements.push (
            if str == '-Inf' then @inf*-1
            else if (str == '+Inf' || str == 'Inf') then @inf 
            else Number str
        ) for str, i in matches when (i != 0 and i != n-1 and str != ',')
        
        total = elements.length
        number = Number number
        
        return number in elements if leftBracket == '{' and rightBracket == '}'
        
        left = 
            if leftBracket == '[' then number >= elements[0]
            else if leftBracket == '(' then number > elements[0]
            else false
        right = 
            if rightBracket == ']' then number <= elements[total - 1]
            else if rightBracket == ')' then number < elements[total - 1]
            else false
        
        left and right
        
    isValidSetNotation: (number, subset) ->
        str = subset.replace 'n', number
        eval str
    
    parse: (string) ->
        matches = (string.split parsePattern) ? []
        [_ref[_i+1], _ref[(_i+=2)+1]] for j in matches
    
    format: (string, number) ->
        for set in @parse string
            return set[1] if @isValid number, set[0]
        false
