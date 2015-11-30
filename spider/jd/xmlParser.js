/**
 * Created by Willam Yang on 11/30/2015.
 */
'use strict';
var EventEmitter = require('events').EventEmitter,
    util = require('util');
var xml = require('node-xml');

module.exports = function(xmlDoc, afterParser) {
    var start =false,
        commentStart = false;
    var goodsInfoList = [];
    var goodsInfo;
    console.log(xmlDoc);
    var parser = new xml.SaxParser(function(cb) {
        cb.onStartElementNS(function(elem, attrs) {
            console.log(elem);
            if (!start && attrs && attrs.id === 'J_goodsList') {
                start = true;
            }
            if (start) {
                if (elem === 'li' &&  attrs.data-sku) {
                    goodsInfo = {};
                    goodsInfo.goodsId = attrs.data-sku;
                }
                if (!goodsInfo.name && elem==='a') {
                    goodsInfo.name = attrs.title;
                }
                if (!goodsInfo.img && elem === 'img') {
                    goodsInfo.img = attrs.src;
                }
                if (!goodsInfo.price && attrs.data-price) {
                    goodsInfo.price = attrs.data-price;
                }
                if (!goodsInfo.commentCount && attrs.id === 'J_comment_' + goodsInfo.goodsId) {
                    commentStart = true;
                }
                goodsInfoList.push(goodsInfo);
            }
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
