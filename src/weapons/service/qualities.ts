import { EventHandler, LrEvent } from "../../EventHandler"

export interface Quality {
    id: WeaponQualityId
    name: string
    type: string
}

// Variable globale qui liste les qualités variables
export const variableQualities = function() {
    const quals: Quality[] = []
    Tables.get("weapon_qualities").each(function(quality: Quality) { 
        if(quality.type === "Variable") {
            quals.push(quality)
        }
    })
    return quals
}()

export const getLabel = function(s: WeaponQualityId) {
    return s + "_Input" as WeaponQualityInputLabel
}

// Formatage des qualités avec leur valeur numérique
export const processQualitiesLabel = function(data: WeaponData) {
    return data.qualities_Choice.map(function(selectedQuality) {
        const quality = Tables.get("weapon_qualities").get<Quality>(selectedQuality)
        if(quality.type === "Variable") {
            if(data[getLabel(quality.id)] as number === undefined) {
                data[getLabel(quality.id)] = 1
            }
            return quality.name.replace( " X", " " + data[getLabel(quality.id)])
        }
        return quality.name
    })
}

export const qualityInputHandler: EventHandler = function(sheet: Sheet) {
    return function() {
        sheet.setData({qualities_Input : processQualitiesLabel(sheet.getData()).join(", ")})
    }
}

// Hide / Show inputs for variable qualities in craft
const setQualityInputs = function(sheet: Sheet, selectedQualities: string[]) {
    variableQualities.forEach(function(quality) { 
        if(selectedQualities.includes(quality.id)) {
            sheet.get(quality.id + "_Label").show()
            sheet.get(quality.id + "_Input").show()
        } else {
            sheet.get(quality.id + "_Label").hide()
            sheet.get(quality.id + "_Input").hide()
        }
    })
}

export const handleCraftQualityChoice = function(sheet: Sheet, choices: LrEvent<string[]>) {
    setQualityInputs(sheet, choices.value()) 
    sheet.setData({qualities_Input : processQualitiesLabel(sheet.getData()).join(", ")})
    if(choices.value().includes("JET")) {
        sheet.setData({throwable_as_Int: 1})
    } else {
        sheet.setData({throwable_as_Int: 0})
    }    
}

export const handleRepeaterQualityChoice = function(entryCmp: Component<WeaponData>, target: LrEvent<WeaponQualityId[]>) {
    setRepeaterQualityInputs(entryCmp, target.value())
    entryCmp.find('qualities_Input').value(processQualitiesLabel(entryCmp.value()).join(", "))
    if(target.value().includes("JET")) {
        entryCmp.find("throwable_as_Int").value(1)
    } else {
        entryCmp.find("throwable_as_Int").value(0)
    }
}

// Hide / Show inputs for variable qualities in repeater
export const setRepeaterQualityInputs = function(component: Component, selectedQualities: WeaponQualityId[]) {
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

export const handleRepeaterQualityInput = function(entryCmp: Component<WeaponData>) { 
    entryCmp.find('qualities_Input').value(processQualitiesLabel(entryCmp.value()).join(", "))
}