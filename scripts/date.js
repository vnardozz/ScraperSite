var makeDate = function(){
    var d = new Date()
    var dateFormatted = ""
    dateFormatted += (d.getMonth() + 1) + "_"
    dateFormatted += d.getDate() + "_"
    dateFormatted += d.getFullYear()

    return dateFormatted
};

module.exports = makeDate;