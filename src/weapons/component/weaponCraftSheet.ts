import { processQualitiesLabel, variableQualities } from "../utils/qualityUtils"
import { handleCharges, handleQualityChange, handleWeaponChoiceCraft } from "../business/weaponCraft"
import { Quality, WeaponData, WeaponSizeId, weaponSizesInt, WeaponTypeId, weaponTypesInt, weaponWieldingsInt } from "../types/weaponTypes"

export interface WeaponCraftSheet extends Sheet<WeaponData> {
    setDefaultData: () => WeaponCraftSheet
    setListeners: () => WeaponCraftSheet
}

export const WeaponCraftSheet = function (this: WeaponCraftSheet) {

    this.setDefaultData = function() {
        // Initialiser les champs
        if(this.getData().qualities_Choice === undefined) {
            this.setData({
                qualities_Choice: []
            })
        }

        if(this.getData().type_Choice === undefined) {
            this.setData({
                type_Choice : 'melee',
                type_Choice_as_Int : weaponTypesInt.melee
            })
        }

        if(this.getData().size_Choice === undefined) {
            this.setData({
                size_Choice : 'uneMain',
                size_Choice_as_Int : weaponSizesInt.uneMain,
                wielding_Choice : 'uneMain',
                wielding_Choice_as_Int : weaponWieldingsInt.uneMain
            })
        }

        if(this.getData().range_Choice === undefined) {
            this.setData({ range_Choice : '1' })
        }

        return this
    }

    this.setListeners = function() {
        const that = this

        // Afficher les valeurs de qualités nécessaires et mettre à jour la liste des qualités à l'update sur les checkbox
        this.get('qualities_Choice').on('update', function() { 
            that.setData({qualities_Input : processQualitiesLabel(that.getData()).join(', ')})
        })
    
        // Update la liste des qualités à l'update des valeurs sur les qualités
        variableQualities.forEach(function(quality: Quality) {
            that.get(quality.id + '_Input').on('update', function() { handleQualityChange(that) })
        })
        
        // Toggle l'affichage des munitions
        this.get('type_Choice').on('update', function(target: LrEvent<WeaponTypeId>){ handleCharges(that, target.value()) })
            
        // Set size choice as int
        this.get('size_Choice').on('update', function(target: LrEvent<WeaponSizeId>) { handleWeaponChoiceCraft(that, target.value()) })

        return this
    }

} as any as { (): WeaponCraftSheet }

