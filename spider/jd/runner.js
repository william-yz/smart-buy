/**
 * Created by Willam Yang on 11/30/2015.
 */
'use strict';

var superagent = require('superagent'),
    cheerio = require('cheerio');

var xmlParser = require('./xmlParser');
superagent.get('http://search.jd.com/Search')
    .query({keyword : '篮球'})
    .query({enc : 'utf-8'})
    .end(function(err, res) {
        if (err) {
            console.log(err);
        } else {
            xmlParser(res.text.replace(/.*DOCTYPE html>/,''), function(result) {
                console.log(result);
            });
        }
    });
