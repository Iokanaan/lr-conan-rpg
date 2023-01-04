import { setSkillListeners } from './skill/listener/skill'
import { rollResultHandler } from './diceroll/business/roll'
import { WeaponRepeater } from './weapons/component/weaponRepeater'
import { TalentRepeater } from './talents/component/talentRepeater'
import { WeaponCraftSheet } from './weapons/component/weaponCraftSheet'


// @ts-ignore
init = function(sheet: Sheet<any>) {
    if (sheet.id() === "main") {
        setSkillListeners(sheet)
        WeaponRepeater
            .call(sheet.get('weapons'))
            .setListeners();
            log("init talents")
        TalentRepeater
            .call(sheet.get('talents'))
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