var process = function () {
    var page = 1, petsTable = [], resultsTable = {}, userID, version = 0.12, phoneHome = false, remoteVersion,
        versionCheckComplete = false, versionAnswer;

    function versionCheck() {
        versionCheckComplete = true;
    }

    function generateOutput() {
        if (!versionCheckComplete) {
            window.setTimeout(generateOutput, 100);
            return;
        }
        var count = 0;
        for (c in resultsTable){
            count += resultsTable[c].length;
        }
        var output = document.createElement('div'), k, ul, li, a, i;
        ul = document.createElement('p');
        $(ul).text("Total pets: "+count);
        $(ul).addClass('keep');
        $(output).append(ul);
        for (k in resultsTable) {
            if (resultsTable.hasOwnProperty(k)) {
                if (resultsTable[k].length > 0) {
                    i = 0;
                    ul = document.createElement('ul');
                    $(ul).text(k);
                    for (i = 0; i < resultsTable[k].length; i += 1) {
                        li = document.createElement('li');
                        a = document.createElement('a');
                        $(a).text(resultsTable[k][i].name);
                        $(a).attr("href", "http://www.aywas.com/pp/view/" + resultsTable[k][i].id + "/");
                        $(li).append(a);
                        $(ul).append(li);
                    }
                }
                $(output).append(ul);
            }
        }
        $('title').text("Aywas Lair Checker - Results");
        if (versionAnswer)
            $('body').append(versionAnswer);
        $('body').append($(output));
        $('p:not(".keep")').hide().queue(function (next) {
            $(this).remove();
            next();
        });
    }

    function addTable(element) {
        var breed, id, name;
        breed = $(element).find(".gen-small > a > strong").text().split(' the ');
        breed = breed[breed.length - 1];
        breed = breed.trim().split('(')[0].trim().replace(/^\s*\S*(Male|Female|Androgynous|Hermaphrodite|Undecided|Robot)/i, "").trim();
        id = Number($(element).find(".gen-small > a > strong").text().split('(').slice(-1)[0].match(/\d+/ig)[0]);
        name = $(element).find(".gen-small > a > strong").text();
            if (!resultsTable[breed]) {
                resultsTable[breed] = [];
            }
            resultsTable[breed].push({id: id, name: name});
    }

    function addTables() {
        var i;
        for (i = 0; i < petsTable.length; i += 1) {
            addTable(petsTable[i]);
        }
        generateOutput();
    }
    
    var pagesRunning = 0;
    function fetchPage() {
        $('body').append($("<p>Loading page " + page + ".  Pets loaded so far: " + petsTable.length + "</p>"));
        $('title').text("Aywas Lair Checker: Loading page " + page + ".  Pets loaded so far: " + petsTable.length);
        var listUrl = "http://www.aywas.com/lair/group/" + userID + "/all/?p=" + page + "&l=240", pageResult = [], i;
        $.ajax(listUrl, {dataType: "text", success: function (xml) {
            pagesRunning += 1;
            page = page + 1;
            xml = xml.replace(/<[^\/<>]*img[^>]*>([^<]*<[^\/\w]*\/img[^>]*>)*/gi, "");
            pageResult = $(xml).find('div#lair-sort-pets > div');
                if (pageResult.length) {
                    fetchPage();}
            for (i = 0; i < pageResult.length; i += 1) {
                petsTable.push(pageResult[i]);
            }
            pagesRunning -= 1;
            page = page + 1;
            if (!pageResult.length) {
                //End load watches for pages running to be 0 and then 
                endLoad();
            }
            
        }});
    }
    function endLoad(){
        if (pagesRunning > 0){
            window.setTimeout(endLoad,100);
        }else {
            $('body').append($("<p>Load complete.  Loaded " + petsTable.length + " pets.</p>"));
            addTables();
        }
    }
    function getUserID() {
        userID = $("div#side > h3 > a");
        if (userID && userID.length) {
            userID = Number(userID.attr('href').match(/\d+/i)[0]);
//            userID=1165;
        }
    }

    var scripts = document.getElementsByTagName('script');
    while (scripts.length) {
        scripts[0].parentElement.removeChild(scripts[0]);
    }
    scripts = document.getElementsByTagName('link');
    while (scripts.length) {
        scripts[0].parentElement.removeChild(scripts[0]);
    }
    var script = document.createElement('script');
    script.src = "//code.jquery.com/jquery-1.10.2.min.js";
    script.type = "text/javascript";
    script.onload = function () {
        getUserID();
        $('body').remove();
        $('html').append($('<body></body>'));
        $('body').append($('<h1>Aywas Lair Lister</h1>'));
        window.setTimeout(versionCheck, 1);
        fetchPage();
    };
    document.getElementsByTagName('head')[0].appendChild(script);
//    window.setTimeout(function(){
//        getUserID();
//        $('body').remove();
//        $('html').append($('<body></body>'));
//        $('body').append($('<h1>Aywas Lair Checker V'+version+'</h1>'));
//        fetchPage();
//    }, 500);
};
if (!(location.host.match(/.*aywas.*/ig) && location.host.match(/.*aywas.*/ig).length) && !(location.hostname.match(/.*aywas.*/ig) && location.hostname.match(/.*aywas.*/ig).length)) {
    alert("Please re-run this bookmarklet from Aywas.com!");
    location.href = "http://www.aywas.com/";
}
else{
    process();
}
