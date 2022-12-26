import { initSkill } from './skill/listener/skill'


// @ts-ignore
init = function(sheet: Sheet<any>) {
    if (sheet.id() === "main") {
        initSkill(sheet)
    }

}
