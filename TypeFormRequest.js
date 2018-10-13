var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var typeFormUrl = 'https://api.typeform.com/forms/tIRk4I/responses';
function  getData(url) {
    var request = new XMLHttpRequest();

    request.open('GET', url, true);
    request.setRequestHeader('Authorization', 'Bearer FJP5o6msKCrmR3dLtxsh8bZ4pNzPU2fQKC6Dorzyt2Bm');
    request.onload = function () {

        // Begin accessing JSON data here
        var data = JSON.parse(request.responseText);


        if (request.status >= 200 && request.status < 400) {
            // console.log(this);
            // console.log(data);
            return getAnswers(data);
        } else {
            console.log('error');
        }
    };

    request.send();
    
}
getData(typeFormUrl);

function getAnswers(jsonData) {
    for (var item in jsonData) {
        if (jsonData.hasOwnProperty(item) && item === "items") {
            // console.log(jsonData[item]);
            for (var x in jsonData[item]) {
                // console.log(x);
                if (jsonData[item].hasOwnProperty(x)) {

                    // console.log(jsonData[item][x])
                    for (var answer in jsonData[item][x]) {
                        if (jsonData[item][x].hasOwnProperty(answer) && answer === "answers") {
                            console.log(jsonData[item][x][answer]);
                        }
                    }
                }
            }
        }
    }
}