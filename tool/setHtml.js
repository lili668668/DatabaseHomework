var fs = require('fs');
var cheerio = require('cheerio');

function setDroplist(htmlFile, droplistId, valueArr, optionArr) {
    var html = fs.readFileSync(htmlFile);
    var s = cheerio.load(html);

    var len = optionArr.length;
    for (var cnt = 0;cnt < len;cnt++) {
        var option = `<option value="${valueArr[cnt]}">${optionArr[cnt]}</option>`;
        s(droplistId).append(option);
    }

    var res = s.html();
    return res;

}

function setText(htmlFile, markid, text) {
    var html = fs.readFileSync(htmlFile);
    var $ = cheerio.load(html);
    $(markid).text(text);
    var res = $.html();
    return res;
}

function setTexts(htmlFile, markid, titles, texts) {
    var html = fs.readFileSync(htmlFile);
    var $ = cheerio.load(html);
    var str = "";
    for (var cnt = 0;cnt < titles.length;cnt++) {
        str += `<p>${titles[cnt]}: <span>${texts[cnt]}</span></p>`;
    }
    $(markid).append(str);
    var res = $.html();
    return res;
}

function setButton(htmlFile, markid, formmethed, formaction, buttonname) {
    var html = fs.readFileSync(htmlFile);
    var $ = cheerio.load(html);

    var str = `<form method="${formmethed}" action="${formaction}">
        <button type="submit">${buttonname}</button>
        </form>`;

    $(markid).append(str);
    var res = $.html();
    return res;
}

function setStatusItem(htmlFile, markid, otherid, otherName) {
    var html = fs.readFileSync(htmlFile);
    var $ = cheerio.load(html);
    
    for (var cnt = 0;cnt < otherid.length;cnt++) {
        var str1 = `<p>${otherName[cnt]}</p>`;
        var str2 = `<input type="text" class="other" id="${otherid[cnt]}" name="${otherid[cnt]}">`;
        var str3 = `<p class="check" id="check_${otherid[cnt]}"></p>`
        $(markid).append(str1);
        $(markid).append(str2);
        $(markid).append(str3);
    }

    var res = $.html();
    return res;
}

function fillBlank(html, blankid, content) {
    var $ = cheerio.load(html);

    for (var cnt = 0;cnt < blankid.length;cnt++) {
        $(blankid[cnt]).val(content[cnt]);
    }

    var res = $.html();
    return res;
}

function setHTMLButton(html, markid, formmethed, formaction, buttonname) {
    var $ = cheerio.load(html);
    
    var str = `<form method="${formmethed}" action="${formaction}">
        <button type="submit">${buttonname}</button>
        </form>`;

    $(markid).append(str);
    var res = $.html();
    return res;
}

function setAddBook_Bookstore(htmlFile, markid, belongBookstore, bookstoreId_array, bookstoreName_array) {
    var html = fs.readFileSync(htmlFile);
    var $ = cheerio.load(html);

    var str = '<select name="bookstore" id="bookstore">';
    if (belongBookstore) {

        str += `<option value="${belongBookstore['BSID']}" selected>${belongBookstore['BSName']}</option>`
    } else {
        var len = bookstoreId_array.length;
        str += '<option value="none" selected>請選擇擁有書店</option>';
        for (var cnt = 0;cnt < len;cnt++) {
            str += `<option value="${bookstoreId_array[cnt]}">${bookstoreName_array[cnt]}</option>`;
        }
    }

    str += "</select>";

    $(markid).append(str);
    var res = $.html();
    return res;

}

module.exports.setDroplist = setDroplist;
module.exports.setText = setText;
module.exports.setTexts = setTexts;
module.exports.setButton = setButton;
module.exports.setStatusItem = setStatusItem;
module.exports.setHTMLButton = setHTMLButton;
module.exports.fillBlank = fillBlank;
module.exports.setAddBook_Bookstore = setAddBook_Bookstore;
