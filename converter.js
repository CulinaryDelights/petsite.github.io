var name = new URLSearchParams(window.location.search)
var changeFirName = name.split('&')[0];
var firstPet = changeFirName.replace('firpet=','');
var changeSecName = name.split("&").pop();
var secondPet = changeSecName.replace('secpet=','');


var humanAge = 79;
var dogAge = 11;
var catAge = 15;
var fishAge = 3;
var birdAge = 18;
var hamsterAge = 3;
var snakeAge = 22;
var axolotlAge = 15;

var isNumber = true;
var animalType;

petDictionary = {
    'dog': dogAge,
    'cat': catAge,
    'hamster': hamsterAge,
    'fish': fishAge,
    'human': humanAge,
    'bird': birdAge,
    'snake': snakeAge,
    'axolotl': axolotlAge
}

var firstParam = petDictionary[firstPet];
var secondParam = petDictionary[secondPet];

var answer = firstParam / secondParam;

answer = answer.toFixed(2);

if(isNaN(firstParam) || isNaN(secondParam)) {
    isNumber = false;
}

if(isNumber) {
    document.getElementById('animalYears').innerHTML = "1 " + firstPet + " year is equivalent to approximately " + answer + " " + secondPet + " years";
}