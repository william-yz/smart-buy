/**
 * Created by Willam Yang on 11/30/2015.
 */
'use strict';

var superagent = require('superagent'),
    cheerio = require('cheerio');
var fs = require('fs');
var xmlParser = require('./xmlParser');
superagent.get('http://search.jd.com/Search')
    .query({keyword : '篮球'})
    .query({enc : 'utf-8'})
    .end(function(err, res) {
        if (err) {
            console.log(err);
        } else {
            var $ = cheerio.load(res.text);
            // var html = $.html().replace(/.*DOCTYPE html>/,''),
            fs.writeFile('./ttt', $('#J_goodsList ul').html());
            xmlParser($('#J_goodsList ul').html(), function(result) {
                console.log(result);
            });
        }
    });
