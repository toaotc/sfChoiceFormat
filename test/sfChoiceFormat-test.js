var assert = require('assert'),
	vows = require('vows'),
	formatChoice = require('../')
	plurals = ['[0]nothing found', '[1]one found', '{2,3,4,5}2 or ... or 5 found', '(5,10)6-9 found', '[10,15)10-14 found', '[15,20]15-20 found', '(30,+Inf] more the 30 found', '[-10,0)less than 0 found', '{n:(n%6 == 0)} mod(6) found', '{n:(1)} %count% found'].join('|')
	;

vows.describe('format_number_choice').addBatch({
	'When providing 0':{
		topic: formatChoice.format_number_choice(plurals, {'%count%': 0}, 0)
		, 'result should be "nothing found"': function (result) {
			assert.isString(result);
			assert.equal(result, 'nothing found');
		}
	}
}).export(module);
