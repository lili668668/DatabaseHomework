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

function setHTMLButton(html, markid, formmethed, formaction, buttonname) {
    var $ = cheerio.load(html);
    
    var str = `<form method="${formmethed}" action="${formaction}">
        <button type="submit">${buttonname}</button>
        </form>`;

    $(markid).append(str);
    var res = $.html();
    return res;
}

module.exports.setDroplist = setDroplist;
module.exports.setText = setText;
module.exports.setTexts = setTexts;
module.exports.setButton = setButton;
module.exports.setHTMLButton = setHTMLButton;
