/**
 * Created by Willam Yang on 11/27/2015.
 */
'use strict';
var runner = require('./jd/runner');

var items = [{
	keyword : 'macbook',
	brand : 'APPLE',
	price : '10000-12000'
},{
	keyword : '篮球',
	brand : '斯伯丁',
	price : '0-100'
},{
	keyword : 'iphone 6s',
	brand : 'APPLE',
	price : '0-6299'
}];
runner(items);
