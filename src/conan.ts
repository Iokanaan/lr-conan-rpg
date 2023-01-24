import { setSkillListeners } from './skill/listener/skill'
import { rollResultHandler } from './diceroll/business/roll'
import { WeaponRepeater } from './weapons/component/weaponRepeater'
import { TalentRepeater } from './talents/component/talentRepeater'
import { WeaponCraftSheet } from './weapons/component/weaponCraftSheet'
import { globalSheets } from './globals'
import { InventoryRepeater } from './inventory/component/inventoryRepeater'
import { getCombatBonus } from './util/utils'
import { setCombatBonus } from './weapons/component/combatMetadata'

/*
TODO
Remplir les attitude
-- terminer les armures
Gestion des bonus de dégats
Gestion de la vigueur/résultation
Gérer les bonus / états
ajouter la couleur
Inventaire Simple
Gérer la bio 
Gérér les talents
Sorts
Monstres
création de personnage
*/



// @ts-ignore
init = function(sheet: Sheet<any>) {
    if (sheet.id() === "main") {
        globalSheets[sheet.getSheetId()] = sheet
        setSkillListeners(sheet)
        WeaponRepeater
            .call(sheet.get('weapons'))
            .setListeners();
        setCombatBonus(sheet)
        TalentRepeater
            .call(sheet.get('talents'))
            .setListeners()
        InventoryRepeater
            .call(sheet.get('objects'))
            .setListeners()
        //initArmorRepeater(sheet)
    }
    
    if (sheet.id() === "weapon_craft") {
        WeaponCraftSheet
            .call(sheet)
            .setDefaultData()
            .setListeners()
    }
}

// @ts-ignore
drop = function(from: Sheet<any>, to: Sheet<any>) {
    if (from.id() === "weapon_craft" && to.id() === "main") {
        return "weapons"
    }
}

// @ts-ignore
initRoll = rollResultHandler

getReferences = function(sheet): Record<string, string | number> {
    log(sheet.id())
    if(sheet.id() === "main") {
        return {
            "meleeBonus": getCombatBonus(sheet.get("CON_Inpt").value()),
            "rangedBonus": getCombatBonus(sheet.get("PERC_Inpt").value()),
            "mentalBonus": getCombatBonus(sheet.get("PERS_Inpt").value())  
        }
    } else {
        return {}
    }
}

