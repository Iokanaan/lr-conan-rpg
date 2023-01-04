import { Quality, WeaponData, WeaponQualityId, WeaponQualityInputName } from "../types/weaponTypes"

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

