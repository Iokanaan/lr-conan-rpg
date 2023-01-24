import { threatHandler } from "../business/threats"

export const initThreats = function(sheet: Sheet<CharData>) {
    sheet.get('regard_acier').on('click', threatHandler(sheet, 'PERSU', 2, [{id: 'ETOU'}]))
}