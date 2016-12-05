var fs = require('fs');
var cheerio = require('cheerio');
var tool = require('./mytool.js');
var con = require('../db/dbConst.js');

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

function setHTMLText(html, markid, text) {
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

function setOrderManageTable(htmlFile, markid, rows) {

    var html = fs.readFileSync(htmlFile);
    var $ = cheerio.load(html);

    var str = "";
    rows.forEach(function(element, index, array) {
        var tmptable = "";
        element[con.sBookName].forEach(function(e, i, a){
            var s = `
                <tr>
                    <td>${e}</td>
                    <td>${element[con.sBookCount][i]}</td>
                </tr>
                `;
            tmptable += s;
        });


        var tmp = `
            <div class="color">
                <div class="target">訂單編號: <span class="OrderNo">${element[con.sOrderNo]}</span></div>
                <div>訂單帳號: <span>${element[con.sAccount]}</span></div>
                <div>下單時間: <span class="OrderTime">${element[con.sOrderTime]}</span></div>
                <div>總價格: <span class="Total_Price">${element[con.sTotalPrice]}</span></div>
                <table border="1">
                    <tr>
                        <th>書名</th>
                        <th>訂購數量</th>
                    </tr>
                    ${tmptable}
                </table>
            </div>
            `;
        str += tmp;
    });

    $(markid).append(str);
    return $.html();
}

function setIndexOrderTable(htmlFile, markid, rows) {
    
    var html = fs.readFileSync(htmlFile);
    var $ = cheerio.load(html);

    var str = "";
    rows.forEach(function(element, index, array) {
        var tmptable = "";

        element[con.sBSName].forEach(function(e, i, a){
            var s = `
                <tr>
                    <td>${e}</td>
                    <td>${element[con.sBookName][i]}</td>
                    <td>${element[con.sBookCount][i]}</td>
                </tr>
                `;
            tmptable += s;
        });

        console.log(${element[con.sOrderTime]});

        var tmp = `
            <div class="color">
                <div class="target">訂單編號: <span class="OrderNo">${element[con.sOrderNo]}</span></div>
                <div>下單時間: <span class="OrderTime">${element[con.sOrderTime]}</span></div>
                <div>總價格: <span class="Total_Price">${element[con.sTotalPrice]}</span></div>
                <table border="1">
                    <tr>
                        <th>出貨書店</th>
                        <th>書名</th>
                        <th>訂購數量</th>
                    </tr>
                    ${tmptable}
                </table>
                <button class="update">修改訂單</button>
            </div>
            `;
        str += tmp;
    });

    $(markid).append(str);
    return $.html();
}

function setManageBookTable(htmlFile, markid, rows) {
    var html = fs.readFileSync(htmlFile);
    var $ = cheerio.load(html);

    if (rows.length == 0) {
        $(markid).append("<p>無書本資料</p>");
    } else {
        var header = 
            `
                <tr>
                    <th>書號</th>
                    <th>書名</th>
                    <th>作者</th>
                    <th>出版商</th>
                    <th>價格</th>
                    <th>修改</th>
                </tr>
            `;
        $(markid).append(header);
        var presame = false;
        var len = rows.length;
        var body = "";
        rows.forEach(function(element, index, array){
            var last =  index == len - 1;
            var nextsame = false;
            if (!last) {
                nextsame = (element["BookID"] == array[index + 1]["BookID"]);
            }

            if (!presame && last) {
                var info = 
                    `
                    <tr>
                        <td id="bookid">${element["BookID"]}</td>
                        <td>${element["BookName"]}</td>
                        <td>${element["Name"]}</td>
                        <td>${element["Publisher"]}</td>
                        <td>${element["Price"]}</td>
                        <td class="parent">
                            <form method="POST" action="/update_book">
                                <input name="bookid" style="display: none" value='${element["BookID"]}'>
                                <button type="submit" class="update">修改</button>
                            </form>
                        </td>
                    </tr>
                    `;
                body += info;

            } else if (presame && last) {
                var info = 
                    `
                        , ${element["Name"]}</td>
                        <td>${element["Publisher"]}</td>
                        <td>${element["Price"]}</td>
                        <td class="parent">
                            <form method="POST" action="/update_book">
                                <input name="bookid" style="display: none" value='${element["BookID"]}'>
                                <button type="submit" class="update">修改</button>
                            </form>
                        </td>
                    </tr>
                    `;
                body += info;

            } else if (!presame && !nextsame) {
                var info = 
                    `
                    <tr>
                        <td id="bookid">${element["BookID"]}</td>
                        <td>${element["BookName"]}</td>
                        <td>${element["Name"]}</td>
                        <td>${element["Publisher"]}</td>
                        <td>${element["Price"]}</td>
                        <td class="parent">
                            <form method="POST" action="/update_book">
                                <input name="bookid" style="display: none" value='${element["BookID"]}'>
                                <button type="submit" class="update">修改</button>
                            </form>
                        </td>
                    </tr>
                    `;
                body += info;
                presame = false;
                
            } else if (!presame && nextsame) {
                var info = 
                    `
                    <tr>
                        <td id="bookid">${element["BookID"]}</td>
                        <td>${element["BookName"]}</td>
                        <td>${element["Name"]}
                    `;
                body += info;
                presame = true;
            } else if (presame && !nextsame) {
                var info = 
                    `
                        , ${element["Name"]}</td>
                        <td>${element["Publisher"]}</td>
                        <td>${element["Price"]}</td>
                        <td class="parent">
                            <form method="POST" action="/update_book">
                                <input name="bookid" style="display: none" value='${element["BookID"]}'>
                                <button type="submit" class="update">修改</button>
                            </form>
                        </td>
                    `;
                body += info;
                presame = false;

            } else if (presame && nextsame) {
                var info = ", " + element["Name"];
                body += info;
                presame = true;
            }

        });
    }
    $(markid).append(body);
    return $.html();

}

function setShopcarTable(htmlFile, markid, rows, bsids, bookids, counts) {
    var html = fs.readFileSync(htmlFile);
    var $ = cheerio.load(html);

    if (rows.length == 0) {
        $(markid).append("<p>無商品資料</p>");
    } else {
        var header = 
            `
                <tr>
                    <th>書號</th>
                    <th>書名</th>
                    <th>作者</th>
                    <th>出版商</th>
                    <th>書店號</th>
                    <th>書店</th>
                    <th>價格</th>
                    <th>訂購數量</th>
                    <th>訂購價格</th>
                    <th>刪除</th>
                </tr>
            `;
        $(markid).append(header);
        var presame = false;
        var len = rows.length;
        var body = "";
        var all_price = 0;
        rows.forEach(function(element, index, array){
            var last =  index == len - 1;
            var nextsame = false;
            if (!last) {
                nextsame = (element["BookID"][0] == array[index + 1]["BookID"][0] && 
                        element["BSID"][0] == array[index + 1]["BSID"][0]);
            }
            var countindex = tool.shopcar_findcountindex(bsids, bookids, element["BSID"][0], element["BookID"][0]);
            var count = counts[countindex];
            var line_price = parseInt(element["Price"]) * count;
            all_price += line_price;

            if (!presame && last) {
                var info = 
                    `
                    <tr>
                        <td id="bookid">${element["BookID"][0]}</td>
                        <td>${element["BookName"]}</td>
                        <td>${element["Name"]}</td>
                        <td>${element["Publisher"]}</td>
                        <td id="bsid">${element["BSID"][0]}</td>
                        <td>${element["BSName"]}</td>
                        <td>${element["Price"]}</td>
                        <td id="c"><input type="number" class="count" value="${count}"></input></td>
                        <td class="linePrice">${line_price}</td>
                        <td class="parent"><button class="delete">刪除</button></td>
                    </tr>
                    `;
                body += info;

            } else if (presame && last) {
                var info = 
                    `
                        , ${element["Name"]}</td>
                        <td>${element["Publisher"]}</td>
                        <td id="bsid">${element["BSID"][0]}</td>
                        <td>${element["BSName"]}</td>
                        <td>${element["Price"]}</td>
                        <td id="c"><input type="number" class="count" value="${count}"></input></td>
                        <td class="linePrice">${line_price}</td>
                        <td class="parent"><button class="delete">刪除</button></td>
                    </tr>
                    `;
                body += info;

            } else if (!presame && !nextsame) {
                var info = 
                    `
                    <tr>
                        <td id="bookid">${element["BookID"][0]}</td>
                        <td>${element["BookName"]}</td>
                        <td>${element["Name"]}</td>
                        <td>${element["Publisher"]}</td>
                        <td id="bsid">${element["BSID"][0]}</td>
                        <td>${element["BSName"]}</td>
                        <td>${element["Price"]}</td>
                        <td id="c"><input type="number" class="count" value="${count}"></input></td>
                        <td class="linePrice">${line_price}</td>
                        <td class="parent"><button class="delete">刪除</button></td>
                    </tr>
                    `;
                body += info;
                presame = false;
                
            } else if (!presame && nextsame) {
                var info = 
                    `
                    <tr>
                        <td id="bookid">${element["BookID"][0]}</td>
                        <td>${element["BookName"]}</td>
                        <td>${element["Name"]}
                    `;
                body += info;
                presame = true;
            } else if (presame && !nextsame) {
                var info = 
                    `
                        , ${element["Name"]}</td>
                        <td>${element["Publisher"]}</td>
                        <td id="bsid">${element["BSID"][0]}</td>
                        <td>${element["BSName"]}</td>
                        <td>${element["Price"]}</td>
                        <td id="c"><input type="number" class="count" value="${count}"></input></td>
                        <td class="linePrice">${line_price}</td>
                        <td class="parent"><button class="delete">刪除</button></td>
                    `;
                body += info;
                presame = false;

            } else if (presame && nextsame) {
                var info = ", " + element["Name"];
                body += info;
                presame = true;
            }

        });
    }
    var aprice = `<div>總價格: <span id="all_price">${all_price}</sapn></div>`;
    body += aprice;
    $(markid).append(body);
    return $.html();
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

function setAddBook_Bookstore(htmlFile, markid, belongBookstore) {
    var html = fs.readFileSync(htmlFile);
    var $ = cheerio.load(html);

    var str = '<select name="bookstore" id="bookstore">';
    if (belongBookstore) {

        str += `<option value="${belongBookstore['BSID']}" selected>${belongBookstore['BSName']}</option>`
    } else {
        str += '<option value="none" selected>請去新增書店</option>';
    }

    str += '</select><p class="check" id="checkBookstore"></p>';

    $(markid).append(str);
    var res = $.html();
    return res;

}

module.exports.setDroplist = setDroplist;
module.exports.setText = setText;
module.exports.setTexts = setTexts;
module.exports.setShopcarTable = setShopcarTable;
module.exports.setManageBookTable = setManageBookTable;
module.exports.setIndexOrderTable = setIndexOrderTable;
module.exports.setOrderManageTable = setOrderManageTable;
module.exports.setButton = setButton;
module.exports.setStatusItem = setStatusItem;
module.exports.setHTMLButton = setHTMLButton;
module.exports.setHTMLText = setHTMLText;
module.exports.fillBlank = fillBlank;
module.exports.setAddBook_Bookstore = setAddBook_Bookstore;
