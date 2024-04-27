import { faker } from "@faker-js/faker";

const deutschChars = [' ', 'a', 'ä', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
'ö', 'p', 'q', 'r', 's', 'ß', 't', 'u', 'ü', 'v', 'w', 'x', 'y', 'z'];
const russianChars = [' ', 'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о',
'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я'];
const englishChars = [ ' ', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const numericChars = [ '-',' ', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const maxStringLength = 40;
const minStringLength = 5;

export function deleteSymbol(str) {
    let array = str.split('');
    array.splice(faker.helpers.arrayElement(Array.from({ length: array.length }, (_,i) =>  i )), 1);
    return array.join('');
}

export function addSymbol(str, region, bool) {
    let array = str.split('');
    if(bool) {
        array.splice(faker.helpers.arrayElement(Array.from({ length: array.length }, (_,i) =>  i )), 0, faker.helpers.arrayElement(numericChars));
    } else {
        if (region === 'de'){
            array.splice(faker.helpers.arrayElement(Array.from({ length: array.length }, (_,i) =>  i )), 0, faker.helpers.arrayElement(deutschChars));
        } else if(region === 'ru'){
            array.splice(faker.helpers.arrayElement(Array.from({ length: array.length }, (_,i) =>  i )), 0, faker.helpers.arrayElement(russianChars));
        } else if(region === 'en'){
            array.splice(faker.helpers.arrayElement(Array.from({ length: array.length }, (_,i) =>  i )), 0, faker.helpers.arrayElement(englishChars));
        }
    }
    return array.join('');
}

export function swapSymbol(str) {
    let array = str.split('');
    let random = faker.helpers.arrayElement(Array.from({ length: array.length-1 }, (_,i) =>  i+1 ));
    let elem = array[random]
    array[random] = array[random+1];
    array[random+1] = elem;
    return array.join('');
}

export function randomError(str, region, bool) {
    let arrayError = [deleteSymbol(str), addSymbol(str, region, bool), swapSymbol(str)];
    if (str.length < minStringLength) arrayError = [addSymbol(str, region, bool), swapSymbol(str)];
    if (str.length > maxStringLength) arrayError = [deleteSymbol(str), swapSymbol(str)];
    let randomError = faker.helpers.arrayElement(arrayError);
    return randomError
}

export function makeMistakes(str, region, bool, count) {
    let countMistake = Math.trunc(count);
    let prob = count - countMistake;
    for(let i = 0; i < countMistake; i++) {
        str = randomError(str, region, bool);
    }
    faker.helpers.maybe(() => { str = randomError(str, region, bool) }, { probability: prob });
    return str;
}
