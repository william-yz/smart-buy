/**
 * Created by Willam Yang on 11/27/2015.
 */
'use strict';
var runner = require('./taobao/runner');

var items = ['Mac Book'];
items.forEach(function(item){
    runner(item);
});
