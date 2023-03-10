export const charToInt = function(letter: string) {
    if(letter === undefined) {
        return 0
    }
    return letter.charCodeAt(0) - 97
}

export const intToChar = function(n: number) {
    return String.fromCharCode(97 + n)
}

export const intToWord = function(n: number) {
    const chars = n.toString().split('')
    let word = ''
    for(var i in chars) {
        word += intToChar(parseInt(chars[i]))
    }
    return word
}

export const wordToInt = function(str: string) {
    const chars = str.split('')
    let res = ''
    for(var i in chars) {
        res += (chars[i].charCodeAt(0) - 97).toString()
    }
    return parseInt(res)
}

export const getCombatBonus = function(val: number) {
    log("calculationg " + val)
    if(val >= 16) { return 5 }
    if(val >= 14) { return 4 }
    if(val >= 12) { return 3 }
    if(val >= 10) { return 2 }
    if(val === 9) { return 1 }
    return 0
}

// Variable globale de gestion des entries sur le repeater des talents
let entryStates: Record<string, RepeaterState> = {}

export const setupRepeater = function(repeater: Component<any>, setupEditEntry: (entry: Component<any>) => void) {
    // Gestion de l'initialisation du mode édition
    repeater.on('click', function(rep: Component<Record<string, TalentData>>) {
        each(rep.value(), function (_, entryId) {
            const entry = rep.find(entryId)
            if(entry.find('mode').value() === 'EDIT') {
                // On init uniquement les entries qui n'était pas en mode EDIT avant
                if(entryStates[entryId] !== 'EDIT') {
                    // Initialisation de l'entry
                    setupEditEntry(entry)
                }
                // L'entry est stockée en mode EDIT
                entryStates[entryId] = 'EDIT'
            } else {
                // L'entry est stockée en mode VIEW
                entryStates[entryId] = 'VIEW'  
            }
        })
    })
}