/**
 * Created by Willam Yang on 11/30/2015.
 */
'use strict';

var superagent = require('superagent'),
    cheerio = require('cheerio'),
    async = require('async'),
    bluebird = require('bluebird');
var fs = require('fs'),
    db = require('../db/dbFacade');

class Runner {
    constructor(oriQuery) {
        this.oriQuery = oriQuery;
    }

    [Symbol.searh](queryItem, page, cb) {
        var queryPage = page * 2 + 1,
            keyword = queryItem.keyword,
            ev = '';
        if (queryItem.brand) {
            ev += 'exbrand_' + queryItem.brand + '@';
        }
        if (queryItem.price) {
            ev += 'exprice_' + queryItem.price + '@';
        }

        superagent.get('http://search.jd.com/Search')
            .query({keyword : keyword})
            .query({page : queryPage})
            .query({enc : 'utf-8'})
            .query({ev : ev})
            .end(function(err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        cb(res);
                    }
                });
    }
}

var search = function(queryItem, page, cb) {
    var queryPage = page * 2 + 1,
        keyword = queryItem.keyword,
        ev = '';
    if (queryItem.brand) {
        ev += 'exbrand_' + queryItem.brand + '@';
    }
    if (queryItem.price) {
        ev += 'exprice_' + queryItem.price + '@'
    }

    superagent.get('http://search.jd.com/Search')
        .query({keyword : keyword})
        .query({page : queryPage})
        .query({enc : 'utf-8'})
        .query({ev : ev})
        .end(function(err, res) {
                if (err) {
                    console.log(err);
                } else {
                    cb(res);
                }
            });
};

function search(queryItem) {
    var i = 0;
    var timer = setInterval(function() {
        search(queryItem, i, handlerGoodsInfo);
        i ++;
        if (i === 10) {
            clearInterval(timer);
        }
    }, 100);
};

function queryAllWithBrand(queryItems) {
    _queryAll(queryItems, search, function() {
        console.log('Done');
        process.exit(0);
    });
}

function queryAllWithoutBrand(queryItems) {
}

function _queryAll(queryItems, handler, next) {
    var index = 0;
    async.whilst(
        function() {
            return index < queryItems.length;
        },
        function(cb) {
            setTimeout(function() {
                cb(handler(queryItems[index]));
            }, 1000);
            index ++;
        },
        next
    );
}
function getBrand(queryItem) {
    search(queryItem, 0, function() {

    });
}

function handlerGoodsInfo(res) {
    var goodsInfoList = parseGoodsHtml(cheerio.load(res.text));
    var storeData = {
        query : queryItem,
        page : page,
        goodsInfo : goodsInfoList
    };
    db.insert('testjd', storeData);
}

function parseGoodsHtml($) {
    var goodsInfoList = [];
    $('#J_goodsList ul li').each(function(i, elem) {
        var li = $(elem),
            id = li.attr('data-sku'),
            goodsInfo = {};
        if (id) {
            var imgAttrs = li.find('img.err-product')[0].attribs,
                priceAttrs = li.find('.p-price .J_' + id)[0].attribs,
                comment = li.find('#J_comment_' + id)[0],
                em = li.find('.p-name em')[0];
            goodsInfoList.push(goodsInfo);
            goodsInfo.id = id;
            var name = '';
            em.children.forEach(function(child) {
                if (child.type === 'text') {
                    name += child.data;
                }
            });
            goodsInfo.name = name;
            goodsInfo.img = imgAttrs.src || imgAttrs['data-lazy-img'];
            goodsInfo.price = Number(priceAttrs['data-price']);
            goodsInfo.comments = Number(comment.children[0].data);
        }
    });
    return goodsInfoList;
}
