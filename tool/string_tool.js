function split(origin, spliter) {
    var list = origin.split(spliter);
    var newlist = [];
    for (var cnt = 0;cnt < list.length;cnt++) {
        newlist.push(list[cnt].trim());
    }

    return newlist;
}

module.exports.split = split;
