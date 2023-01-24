import { getCombatBonus } from "../../util/utils"

export const setCombatBonus = function(sheet: Sheet<CharData>) {
    sheet.get('melee_bonus').value(getCombatBonus(sheet.get("CON_Inpt").value()))
    sheet.get('ranged_bonus').value(getCombatBonus(sheet.get("PERC_Inpt").value()))
    sheet.get('mental_bonus').value(getCombatBonus(sheet.get("PERS_Inpt").value()))
}