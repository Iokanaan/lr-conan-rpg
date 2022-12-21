import { rollComp } from "../diceroll/diceroll"

export const initComp = function(sheet) {
    Tables.get("skills").each(function(skill) {
        sheet.get(skill.id+"_btn").on("click", function() {
            rollComp(sheet, skill, [])
        })
    })
}
