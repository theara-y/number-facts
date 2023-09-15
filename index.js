$('#submit').on('click', function(event) {
    event.preventDefault();
    if(validateNumbersInput()) {
        const formInputs = getFormInputs();
        console.log(formInputs);
        renderFacts(formInputs);        
    }
});

function getFormInputs() {
    return {
        numbers: $('#numbers').val().split(' ').map(num => +num),
        count: +$('#count').val(),
        type: $('input:checked').val()
    }
}

function validateNumbersInput() {
    const numbersInput = $('#numbers').val().trim()
    if(numbersInput.length > 0) {
        for(let numberInput of numbersInput.split(' ')) {
            if(isNaN(numberInput))
                return false;
        }
        return true;
    }
    return false;
}

const URL = 'http://numbersapi.com'
const config = {
    headers: {
        'Content-Type': 'application/json'
    }
}

function getFact(number, type) {
    return axios.get(`${URL}/${number}/${type}`, config)
}

function getFactsForNumber(number, count, type) {
    let promises = [];
    for(let i = 1; i <= count; i++) {
        promises.push(getFact(number, type))
    }
    return promises;
}

function renderFacts({numbers, count, type}) {
    let allPromises = [];
    for(let number of numbers) {
        allPromises.push(Promise.all(getFactsForNumber(number, count, type)))
    }

    Promise.all(allPromises)
        .then(allPromises => {
            displayAllGroups(
                allPromises.map(promiseGroup => {
                    console.log('group', promiseGroup);
                    return createUlGroup(type, promiseGroup.map(promise => promise.data));
                })
            )
        })
}

function createUlGroup(type, dataSet) {
    let groupHeader;
    if(type === 'date') {
        groupHeader = dataSet[0].split(' ').slice(0, 2).join(" ")
    } else {
        groupHeader = dataSet[0][0];
    }

    const container = $('<div></div>')
    const capType = type[0].toUpperCase() + type.slice(1)
    const header = $(`<h2>${capType} Facts for: ${groupHeader}</h2>`)

    const ulGroup = $('<ul></ul>')
    for(let data of new Set(dataSet)) {
        ulGroup.append($(`<li>${data}</li>`));
    }

    container.append(header);
    container.append(ulGroup);
    return container;
}

function displayAllGroups(ulGroups) {
    $('#facts').empty().append(ulGroups)
}

