

// Variable globale de gestion des entries sur le repeater des armes
let globalTalentEntryStates = {}

// Initialisation du repeater des armes
export const initTalentRepeater = function(sheet) {

    // Gestion de l'initialisation du mode édition
    sheet.get("talents").on("click", function(repeater) {
        each(repeater.value(), function (entryData, entryId) {
            const entryCmp = repeater.find(entryId)
            if(entryCmp.find("mode").value() === "EDIT") {
                // On init uniquement les entries qui n'était pas en mode EDIT avant
                if(globalTalentEntryStates[entryId] !== "EDIT") {
                    // Initialisation de l'entry
                    initRepeaterEditTalent(sheet, entryCmp)
                }
                // L'entry est stockée en mode EDIT
                globalTalentEntryStates[entryId] = "EDIT"
            } else {
                // L'entry est stockée en mode VIEW
                globalTalentEntryStates[entryId] = "VIEW"  
            }
        })
    })
}

// Initalisation d'une entry du repeater des talents
const initRepeaterEditTalent = function(sheet, entryCmp) { 
    const availableChoices = {}
    const currentTalentsArray = []
    const talentSkill = Tables.get("talents").get(entryCmp.value().talents_Choice).skill
    switch (talentSkill) {
        case "ORIG":
            entryCmp.find("talent_skill").value("Origine")
            break
        case "CAST":
            entryCmp.find("talent_skill").value("Caste")
            break
        default:
            entryCmp.find("talent_skill").value(Tables.get("skills").get(talentSkill).name)
    }
    each(sheet.getData().talents, function(entry) {
        currentTalentsArray.push(entry.talents_Choice)
    })
    Tables.get("talents").each(function(talent) {
        if(isTalentAvailable(sheet.getData(), talent, currentTalentsArray)) {
            availableChoices[talent.id] = talent.name
        }
    })
    entryCmp.find("talents_Choice").setChoices(availableChoices)
    // Afficher les valeurs de qualités nécessaires et mettre à jour la liste des qualités à l'update sur les checkbox
    entryCmp.find("talents_Choice").on("update", function(target) {
        const talent = Tables.get("talents").get(target.value())
        entryCmp.find("talent_desc").value(talent.description)
        entryCmp.find("talent_skill").value(Tables.get("skills").get(talent.skill).name)
        entryCmp.find("talent_name").value(talent.name)
    })
}



const isTalentAvailable = function(sheetData, talent, currentTalentsArray) {
    if(talent.skill === "ORIG" || talent.skill === "CAST") {
        return false
    }

    if(talent.prerequisite === "") {
        return true
    }
    // Or + And non gérée, compliqué et aucun talend possède les deux conditions
    // Paramètres pour AND
    let reduceFunction = function(previous, current) {
        return previous && current
    }
    let initialValue = true
    let splitCond = "&&"
    // Paramètres pour OR
    if(talent.prerequisite.indexOf("||") !== -1) {
        reduceFunction = function(previous, current) {
            return previous || current
        }
        initialValue = false
        splitCond = "||"
    }
    const prerequisiteArray = talent.prerequisite.split(splitCond)
    return prerequisiteArray.map(function(cond) {
        const condArray = cond.split("=")
        if(condArray[0] !== "Tlt") {
            return sheetData[condArray[0]] >= condArray[1]
        } else {
            return currentTalentsArray.includes(condArray[1])
        }
    }).reduce(reduceFunction, initialValue)
}