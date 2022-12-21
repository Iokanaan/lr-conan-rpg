import { initComp } from './skill/skill'
import { initArmorRepeater } from './armor/armor'
import { initTalentRepeater } from './talent/talent'
import { initWeaponsRepeater, initWeaponCraft } from  './weapons/weapons'
import { roll } from './diceroll/diceroll'

init = function(sheet) {
    if (sheet.id() === "main") {
        initComp(sheet)
        initWeaponsRepeater(sheet)
        initTalentRepeater(sheet)
        initArmorRepeater(sheet)
    }
    if (sheet.id() === "weapon_craft") {
        initWeaponCraft(sheet)
    }
}

drop = function(from, to) {
    if (from.id() === "weapon_craft" && to.id() === "main") {
        return "weapons"
    }
}

initRoll = roll