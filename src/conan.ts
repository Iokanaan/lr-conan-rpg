import { initSkill } from './skill/listener/skill'
import { initArmorRepeater } from './armor/armor'
import { initTalentRepeater } from './talent/talent'
import { initWeaponsRepeater } from './weapons/listener/repeater'
import { initWeaponCraft } from './weapons/listener/craft'
import { roll } from './diceroll/diceroll'

// @ts-ignore
init = function(sheet: Sheet<any>) {
    if (sheet.id() === "main") {
        initSkill(sheet)
        initWeaponsRepeater(sheet)
        initTalentRepeater(sheet)
        initArmorRepeater(sheet)
    }
    if (sheet.id() === "weapon_craft") {
        initWeaponCraft(sheet)
    }
}

// @ts-ignore
drop = function(from: Sheet<any>, to: Sheet<any>) {
    if (from.id() === "weapon_craft" && to.id() === "main") {
        return "weapons"
    }
}

// @ts-ignore
initRoll = roll