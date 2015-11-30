/**
 * Created by Willam Yang on 11/30/2015.
 */
'use strict';
var EventEmitter = require('events').EventEmitter,
    util = require('util');
var xml = require('node-xml');

function getAttr(attrs) {
    if (!attrs || attrs.length == 0) {
        return function () {
            return null;
        }
    }
    return function(attrName) {
        for (var i = 0,ln = attrs.length; i < ln; i ++) {
            if (attrs[i][0] === attrName) {
                return attrs[i][1];
            }
        }
        return null;
    }
}
module.exports = function(xmlDoc, afterParser) {
    var commentStart = false;
    var goodsInfoList = [];
    var goodsInfo;
    var parser = new xml.SaxParser(function(cb) {
        cb.onStartElementNS(function(elem, attrs) {
            var attrFinder = getAttr(attrs);
            var goodsId = attrFinder('data-sku'),
                name = attrFinder('title'),
                img = attrFinder('src'),
                price = attrFinder('data-price'),
                id = attrFinder('id');
                console.log(elem);
            if (elem === 'li' &&  goodsId) {
                goodsInfo = {};
                goodsInfo.goodsId = goodsId;
            }
            if (!goodsInfo.name && elem === 'a' && name) {
                goodsInfo.name = name;
            }
            if (!goodsInfo.img && elem === 'img' && img) {
                goodsInfo.img = img;
            }
            if (!goodsInfo.price && price) {
                goodsInfo.price = price;
            }
            if (!goodsInfo.commentCount && id === 'J_comment_' + goodsInfo.goodsId) {
                commentStart = true;
            }
            goodsInfoList.push(goodsInfo);
        });
        cb.onCharacters(function(chars) {
            if (commentStart) {
                goodsInfo.commentCount = Number(chars);
                commentStart = false;
            }
        });
        cb.onEndDocument(function() {
           afterParser(goodsInfoList);
        });

        cb.onError(function(msg) {
            console.log(msg);
        });
    });
    parser.parseString(xmlDoc);
};
