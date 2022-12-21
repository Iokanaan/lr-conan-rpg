import { setCharges } from "../business/charges"
import { handleQualityInput, variableQualities } from "../business/qualities"
import { handleWeaponChoiceCraft } from "../business/wielding"
import { WeaponData, WeaponSizeId, weaponSizesInt, weaponTypesInt, weaponWieldingsInt } from "../types/weaponData"

export const initWeaponCraft = function(sheet: Sheet<WeaponData>) {
    // Initialiser les champs
    if(sheet.getData().qualities_Choice === undefined) {
        sheet.setData({
            qualities_Choice: []
        })
    }
    if(sheet.getData().type_Choice === undefined) {
        sheet.setData({
            type_Choice : "melee",
            type_Choice_as_Int : weaponTypesInt.melee
        })
    }
    if(sheet.getData().size_Choice === undefined) {
        sheet.setData({
            size_Choice : "uneMain",
            size_Choice_as_Int : weaponSizesInt.uneMain,
            wielding_Choice : "uneMain",
            wielding_Choice_as_Int : weaponWieldingsInt.uneMain
        })
    }

    if(sheet.getData().range_Choice === undefined) {
        sheet.setData({ range_Choice : "1" })
    }

    // Afficher les valeurs de qualités nécessaires et mettre à jour la liste des qualités à l'update sur les checkbox
    sheet.get("qualities_Choice").on("update", function() { handleQualityInput(sheet) })

    // Update la liste des qualités à l'update des valeurs sur les qualités
    variableQualities.forEach(function(quality) {
        sheet.get(quality.id + "_Input").on('update', function() { handleQualityInput(sheet) })
    })
    // Toggle l'affichage des munitions
    sheet.get("type_Choice").on("update", function(event){ setCharges(sheet, event.value())})
    
    // Set size choice as int
    sheet.get("size_Choice").on("update", function(target: LrEvent<WeaponSizeId>) {
        handleWeaponChoiceCraft(sheet, target)
    })
}
