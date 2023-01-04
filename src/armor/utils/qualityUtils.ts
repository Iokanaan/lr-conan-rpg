import { ArmorData, ArmorQuality, ArmorQualityId, ArmorQualityInputName } from "../types/ArmorTypes"

export const getLabel = function(s: ArmorQualityId) {
    return s + "_Input" as ArmorQualityInputName
}

// Formatage des qualités avec leur valeur numérique
export const processQualitiesLabel = function(data: ArmorData) {
    return data.qualities_Choice.map(function(selectedQuality) {
        const quality = Tables.get("weapon_qualities").get<ArmorQuality>(selectedQuality)
        if(quality.type === "Variable") {
            if(data[getLabel(quality.id)] as number === undefined) {
                data[getLabel(quality.id)] = 1
            }
            return quality.name.replace( " X", " " + data[getLabel(quality.id)])
        }
        return quality.name
    })
}

