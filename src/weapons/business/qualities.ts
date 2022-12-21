import { intToLetter } from "../../util/utils"
import { Quality, WeaponData, WeaponQualityId, WeaponQualityInputName } from "../types/weaponData"

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
    return s + "_Input" as WeaponQualityInputName
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

export const handleQualityInput = function(sheet: Sheet<WeaponData>) {
    sheet.setData({qualities_Input : processQualitiesLabel(sheet.getData()).join(", ")})
}

export const handleCraftQualityChoice = function(sheet: Sheet<WeaponData>, choices: LrEvent<string[]>) {
    variableQualities.forEach(function(quality) { 
        if(choices.value().includes(quality.id)) {
            sheet.get(quality.id + "_Label").show()
            sheet.get(getLabel(quality.id)).show()
        } else {
            sheet.get(quality.id + "_Label").hide()
            sheet.get(getLabel(quality.id)).hide()
        }
    })
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
            component.find(getLabel(quality.id)).show()
        } else {
            component.find(quality.id + "_Label").hide()
            component.find(getLabel(quality.id)).hide()
        }
    })
}

export const handleRepeaterQualityInput = function(entryCmp: Component<WeaponData>) { 
    entryCmp.find('qualities_Input').value(processQualitiesLabel(entryCmp.value()).join(", "))
}

export const processQualitiesTag = function(data: WeaponData) {
    return data.qualities_Choice.map(function(selectedQuality) {
        const quality = Tables.get("weapon_qualities").get(selectedQuality) as Quality
        if(quality.type === "Variable") {
            if(data[getLabel(quality.id)] === undefined) {
                data[getLabel(quality.id)] = 1
            }
            // Sale, les tags ne peuvent pas contenir de chiffre, on doit compter avec des lettres
            return "q_" + quality.id.replace( "_X", "_" + intToLetter(data[getLabel(quality.id)] ?? 1))
        }
        return "q_" + quality.id
    })
}