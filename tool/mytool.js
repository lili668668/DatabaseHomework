var db_select = require('../db/select.js');

function split(origin, spliter) {
    var list = origin.split(spliter);
    var newlist = [];
    for (var cnt = 0;cnt < list.length;cnt++) {
        newlist.push(list[cnt].trim());
    }

    return newlist;
}

function shopcar_findcountindex(bsids, bookids, bsid, bookid) {
    var flag = -1;
    bsids.forEach(function(element, index, array){
        if (element == bsid && bookids[index] == bookid) {
            flag = index;
        }
    });
    return flag;
}

function getAllPrice(bsids, bookids, counts, callback) {
    db_select.books_info(bsids, bookids, function(rows){
        var all_price = 0;
        rows.forEach(function(element, index, array) {
            var countindex = shopcar_findcountindex(bsids, bookids, element["BSID"][0], element["BookID"][0]);
            var count = counts[countindex];
            all_price += parseInt(element["Price"]) * count;
        });

        if (callback) {
            callback(all_price);
        }
    });
}

function getAllPriceAndLinePrice(bsids, bookids, counts, lineindex, callback) {
    db_select.books_info(bsids, bookids, function(rows){
        var line_price = 0;
        var all_price = 0;
        rows.forEach(function(element, index, array) {
            var countindex = shopcar_findcountindex(bsids, bookids, element["BSID"][0], element["BookID"][0]);
            var count = counts[countindex];
            if (lineindex == countindex) {
                line_price = parseInt(element["Price"]) * count;
            }
            all_price += parseInt(element["Price"]) * count;
        });

        if (callback) {
            callback(line_price, all_price);
        }
    });
}

module.exports.split = split;
module.exports.shopcar_findcountindex = shopcar_findcountindex;
module.exports.getAllPrice = getAllPrice;
module.exports.getAllPriceAndLinePrice = getAllPriceAndLinePrice;
