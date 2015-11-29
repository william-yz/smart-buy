/**
 * Created by Willam Yang on 11/27/2015.
 */
'use strict';

var superagent = require('superagent'),
    fs = require('fs');

var config = require('./config'),
    db = require('../db/dbFacade');

var homeSearchUrl = config.homeSearchUrl,
    rgExpToMatch = new RegExp(config.rgExpToMatch),
    rgExpToReplace = new RegExp(config.rgExpToReplace);

var seachItem = '篮球';
superagent.get(homeSearchUrl+'?q='+seachItem + '&data-key=s&data-value=66' )
    .end(function(err, res) {
        var text = res.text.match(rgExpToMatch).toString();
        text = text.substring(0,text.length-1);
        text = text.replace(rgExpToReplace,'');
        text = text.replace(';','###');

        db.insert('odatatest', text);
        // fs.writeFile('./test', text, function(){
        //     console.log('done!');
        // });
        // var t = JSON.parse(text);
        // console.info(t.mods.itemlist.data.auctions);
    });
