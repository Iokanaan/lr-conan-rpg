export const charToInt = function(letter: string) {
    if(letter === undefined) {
        return 0
    }
    return letter.charCodeAt(0) - 96
}

export const intToChar = function(n: number) {
    return String.fromCharCode(96 + n)
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
        res += (chars[i].charCodeAt(0) - 96).toString()
    }
    return parseInt(res)
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