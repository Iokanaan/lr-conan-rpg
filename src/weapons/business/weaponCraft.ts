import { WeaponCraftSheet } from "../component/weaponCraftSheet"
import { WeaponSizeId, weaponSizesInt, WeaponTypeId, weaponTypesInt, WeaponWieldingId, weaponWieldingsInt } from "../types/weaponTypes"
import { processQualitiesLabel } from "../utils/qualityUtils"

export const handleWeaponChoice = function(sheet: WeaponCraftSheet, weaponSize: WeaponSizeId) {

    let wieldingChoice: WeaponWieldingId = 'deuxMains'
    if(weaponSize === 'uneMain' || weaponSize === 'desequlibree') {
        wieldingChoice = 'uneMain'
    }
    sheet.setData({
        size_Choice_as_Int : weaponSizesInt[weaponSize],
        wielding_Choice : wieldingChoice,
        wielding_Choice_as_Int : weaponWieldingsInt[wieldingChoice]
    })
}

export const handleQualityChange = function(sheet: WeaponCraftSheet) {
    sheet.setData({qualities_Input : processQualitiesLabel(sheet.getData()).join(', ')})
}

export const handleCharges = function(sheet: WeaponCraftSheet, type: WeaponTypeId) {

    sheet.setData({ type_Choice_as_Int: weaponTypesInt[type] })
         
    if(type === 'ranged') {
        // Alimentation du champ integer pour les champs calculés
        sheet.get('charges_Input').show()
        sheet.get('charges_Label').show()
    } else {
        // Alimentation du champ integer pour les champs calculés
        sheet.get('charges_Input').hide()
        sheet.get('charges_Label').hide()
    }
}

export const handleWeaponChoiceCraft = function(sheet: WeaponCraftSheet, weaponSize: WeaponSizeId) {

    let wieldingChoice: WeaponWieldingId = "deuxMains"
    if(weaponSize === "uneMain" || weaponSize === "desequlibree") {
        wieldingChoice = "uneMain"
    }
    sheet.setData({
        size_Choice_as_Int : weaponSizesInt[weaponSize],
        wielding_Choice : wieldingChoice,
        wielding_Choice_as_Int : weaponWieldingsInt[wieldingChoice]
    })
}