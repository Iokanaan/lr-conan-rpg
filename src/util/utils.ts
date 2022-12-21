export const letterToInt = function(letter: string) {
    return letter.charCodeAt(0) - 96
}

export const intToLetter = function(n: number) {
    return String.fromCharCode(96 + n)
}
