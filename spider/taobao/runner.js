/**
 * Created by Willam Yang on 11/27/2015.
 */
'use strict';

var superagent = require('superagent'),
    fs = require('fs'),
    moment = require('moment');

var config = require('./config'),
    db = require('../db/dbFacade');

var homeSearchUrl = config.homeSearchUrl,
    rgExpToMatch = new RegExp(config.rgExpToMatch),
    rgExpToReplace = new RegExp(config.rgExpToReplace),
    pagesToSearch = config.pagesToSearch,
    pageDataValue = config.pageDataValue;

var searchItem = '篮球';
for (var i = 0; i < pagesToSearch; i ++) {
    var dataValue = pageDataValue * i;
    superagent.get(homeSearchUrl+'?q='+searchItem + '&data-key=s&data-value=' + dataValue )
        .end(function(err, res) {
            if (err) {
                console.log(err);
            } else {
                var text = res.text.match(rgExpToMatch);
                if (text) {
                    text = text.toString();
                } else {
                    console.log(res.text);
                    return;
                }
                text = text.substring(0,text.length-1);
                text = text.replace(rgExpToReplace,'');
                var parsedText = JSON.parse(text),
                    itemInfoList = parsedText.mods.itemlist.data.auctions,
                    today = moment().format('YYYYMMDD'); 
                itemInfoList.forEach(function(itemInfo) {
                    itemInfo.searchItem = searchItem;
                });
                db.insert('originData' + today, itemInfoList);
                // fs.writeFile('./test', text, function(){
                //     console.log('done!');
                // });
                // 
                // console.info(t.mods.itemlist.data.auctions);
            }
            
        });
}

