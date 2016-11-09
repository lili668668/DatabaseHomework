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

module.exports.setDroplist = setDroplist;
