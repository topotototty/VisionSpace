const ALPHANUM
    = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const HEX_DIGITS = '0123456789abcdef';

export function randomAlphanumString(length) {
    return _randomString(length, ALPHANUM);
}

export function randomElement(arr) {
    return arr[randomInt(0, arr.length - 1)];
}

export function randomHexDigit() {
    return randomElement(HEX_DIGITS);
}

export function randomHexString(length) {
    return _randomString(length, HEX_DIGITS);
}

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function _randomString(length, characters) {
    let result = '';

    for (let i = 0; i < length; ++i) {
        result += randomElement(characters);
    }

    return result;
}