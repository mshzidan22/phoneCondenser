let data;
let headers = [];
let selectedHeaders = [];
let unselectedHeaders = [];
let phoneOne;
let PhoneRange = []
let finalCSV;


function readCSV(file) {

    Papa.parse(file.files[0], {
        header: true,
        complete: function(results) {
            data = results.data;
        }
    });
    setTimeout(() => {
        headers = Object.keys(data[0])
        document.getElementById("pannel").innerHTML = insertChecks(headers);
        document.getElementById("tab2").style.display = "inline";

    }, 1000)
}

function selectHeaders() {
    selectedHeaders = []

    document.querySelectorAll(".form-check-input:checked").forEach(input => selectedHeaders.push(input.value));
    unselectedHeaders = headers.filter(x => !selectedHeaders.includes(x))
    document.getElementById("phone1Container").innerHTML = insertRadio(unselectedHeaders);
    document.getElementById("tab3").style.display = "inline";

}

function selectPhoneOne() {
    phoneOne = document.querySelector("#phone1Container .form-check-input:checked").value;
    unselectedHeaders = headers.filter(x => !selectedHeaders.includes(x)).filter(x => x !== phoneOne)
    document.getElementById("phonesRangeContainer").innerHTML = insertChecks(unselectedHeaders)
    document.getElementById("tab4").style.display = "inline";

}

function selectPhonesRange() {
    PhoneRange = []
    document.querySelectorAll(" #phonesRangeContainer .form-check-input:checked")
        .forEach(input => PhoneRange.push(input.value));


    let uniqueData1 = removeDuplicate(data, phoneOne)
        //let uniqueData2 = removeDuplicate2(data, phoneOne)
        //let uniqueData3 = removeDuplicate3(data, phoneOne)

    //console.log(uniqueData1, uniqueData2, uniqueData3)
    let finalData = condenceData(uniqueData1)
        //console.log(finalData);
    createTable(finalData)
    finalCSV = Papa.unparse(finalData)
        //console.log(finalCSV)
    document.getElementById("tab5").style.display = "inline";


}



function insertChecks(headers) {
    let html = "";
    headers.forEach((element, i) => {
        let rand = Math.random();
        // html += `${element} <input class="form-check form-check-inline" type="checkbox" value="${element}" id="flexCheckDefault"><br>`
        html += `<div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" id="inlineCheckbox${rand}" value="${element}">
        <label class="form-check-label" for="inlineCheckbox${rand}">${element}</label>
       </div> `


    });
    return html;
}

function insertRadio(headers) {
    let html = "";
    headers.forEach((element, i) => {
        // html += `${element} <input class="form-check-input" type="radio" value="${element}" id="flexCheckDefault"><br>`
        html += `<div class="form-check form-check-inline">
        <input class="form-check-input" type="radio"  name="inlineRadioOptions" id="inlineRadio${i}" value="${element}">
        <label class="form-check-label" for="inlineRadio${i}">${element}</label>
       </div> `

    });

    return html;
}


function isSame(obj1, obj2) {
    let result = true;
    for (let head of selectedHeaders) {
        if (obj1[head] !== obj2[head]) {
            result = false;
            break;
        }
    }
    return result;


}

function condenceData(data) {
    let finalArray = []
    let subArray = []

    for (let i = 0; i < data.length; i++) {
        if (i == 0) { subArray.push(data[i]); continue; }
        let isEqual = isSame(data[i], data[i - 1]);
        if (isEqual) {
            subArray.push(data[i]);
        } else if (!isEqual) {
            finalArray.push(merge(subArray))
            subArray = []
            subArray.push(data[i])
        }

    }
    return finalArray;
}


function merge(arr) {
    if (arr.length == 1) return arr[0]
    let finalObj = arr[0];
    for (let i = 1; i < arr.length; i++) {
        finalObj[PhoneRange[i - 1]] = arr[i][phoneOne]
    }
    return finalObj;
}


function removeDuplicate(arr, phoneField) {
    let result = [];
    let phone;
    let previousPhone;
    for (let i = 0; i < arr.length; i++) {
        phone = arr[i][phoneField]
        if (phone !== previousPhone) result.push(arr[i])

        previousPhone = phone
    }
    return result;
}


function removeDuplicate2(arr, selectedHeaders) {
    let result = [];
    let row;
    let previousRow = {};
    for (let obj of arr) {
        row = obj;
        for (let head of selectedHeaders) {
            if (row[head] !== previousRow[head]) {
                break;
            }

        }
        result.push(row);
        previousRow = row;
    }

    return result;

}

function removeDuplicate3(arr, selectedHeaders) {
    return [...new Set(arr)]

}

//not completed
function createTable(finalData) {

    let tableHeads = Object.keys(finalData);
    console.log("is working")
    let headHtml = "";
    for (const head of tableHeads) {
        headHtml += `<th scope="col"> ${head}</th>`
    }

}


function downloadFile() {
    let btn = document.getElementById("downloadBtn")
    let blob = new Blob([finalCSV], {
        type: "text/csv;charset=utf-8;"
    });
    let url = URL.createObjectURL(blob)
    btn.href = url;
    btn.setAttribute('download', 'result.csv');
    btn.click();

}


//////////////////////////////////////////////////////////////