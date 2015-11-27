/**
 * Created by Willam Yang on 11/27/2015.
 */
'use strict';

var superagent = require('superagent');

//superagent.get('http://www.taobao.com')
//    .end(function(err, res){
//       console.log(res.text);
//    });

var qs = {
    initiative_id: 'tbindexz_20151127',
    ie: 'utf8',
    spm: 'a21bo.7724922.8452-taobao-item.2',
    sourceId: 'tb.index',
    search_type: 'item',
    ssid : 's5-e',
    commend : 'all',
    q : '??',
    _input_charset : 'urf-8',
    wq : 'lanqiu',
    suggest_query : 'lanqiu',
    source : 'suggest'
};
superagent.get('https://s.taobao.com/search?&initiative_id=staobaoz_20120515&q=%E7%AF%AE%E7%90%83&suggest=history_1&_input_charset=utf-8&wq=lanqiu&suggest_query=lanqiu&source=suggest')
    .end(function(err, res) {
       console.log(res.text);
    });
