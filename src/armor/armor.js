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

    if(entryCmp.find('type_Choice_as_Int').value()) {}

    // Afficher les valeurs de qualités nécessaires et mettre à jour la liste des qualités à l'update sur les checkbox
    entryCmp.find("qualities_Choice").on("update", function(target) {
        entryCmp.find('qualities_Inpt').value(processQualitiesLabel(entryCmp.value()).join(", "))
    })

    entryCmp.find("coverage_Choice").on("update", function(target) {
        entryCmp.find('coverage_Inpt').value(processQualitiesLabel(entryCmp.value()).join(", "))
    })

    // Toggle l'affichage des munitions
    entryCmp.find("type_Choice").on("update", function(target) {
       entryCmp.find('type_Choice_as_Int').value(armorTypeInt[target.value()])
    })

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