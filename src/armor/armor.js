const globalArmorEntryStates = []

//region ARMORS
export const initArmorRepeater = function(sheet) {
    // Gestion de l'initialisation du mode édition
    sheet.get("armors").on("click", function(repeater) {
        each(repeater.value(), function (entryData, entryId) {
            const entryCmp = repeater.find(entryId)
            if(entryCmp.find("mode").value() === "EDIT") {
                // On init uniquement les entries qui n'était pas en mode EDIT avant
                if(globalArmorEntryStates[entryId] !== "EDIT") {
                    // Initialisation de l'entry
                    initRepeaterEditArmor(entryCmp, entryData)
                }
                // L'entry est stockée en mode EDIT
                globalArmorEntryStates[entryId] = "EDIT"
            } else {
                // L'entry est stockée en mode VIEW
                globalArmorEntryStates[entryId] = "VIEW"  
            }
        })
    })
}

const initRepeaterEditArmor = function(entryCmp) {

   
}

// Hide / Show inputs for variable qualities in repeater
const setArmorRepeaterQualityInputs = function(component, selectedQualities) {
    variableQualities.forEach(function(quality) { 
        if(selectedQualities.includes(quality.id)) {
            component.find(quality.id + "_Label").show()
            component.find(quality.id + "_Input").show()
        } else {
            component.find(quality.id + "_Label").hide()
            component.find(quality.id + "_Input").hide()
        }
    })
}