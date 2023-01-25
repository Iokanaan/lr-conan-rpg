import { redouteThreatHandler, solRougeThreatHandler, threatHandler } from "../business/threats"

export const setThreats = function(sheet: Sheet<CharData>) {
    sheet.get('regard_acier').on('click', threatHandler(sheet, ['PERSU'], 2, [{id: 'ETOU'}]))
    sheet.get('couteau_gorge').on('click', threatHandler(sheet, ['MEL', 'FUR'], 4, [{id: 'ETOU'}, {id: 'CRU', lvl: 1}]))
    sheet.get('titan').on('click', threatHandler(sheet, ['ATH'], 5, [{id: 'ETOU'}, {id: 'ZON'}]))
    sheet.get('redoute').on('click', redouteThreatHandler(sheet, ['COM', 'DIS'], [{id: 'ZON'}]))
    sheet.get('regard_mort').on('click', threatHandler(sheet, ['MEL'], 3, [{id: 'CRU', lvl: 1}, {id: 'ZON'}]))
    sheet.get('sorcellerie_manifeste').on('click', threatHandler(sheet, ['SOR'], 5, [{id: 'INT'}, {id: 'ZON'}]))
    sheet.get('sol_rouge').on('click', solRougeThreatHandler(sheet, ['MEL', 'DIS'], [{id: 'ZON'}]))
    sheet.get('tison').on('click', threatHandler(sheet, ['SUR'], 5, [{id: 'ETOU'}, {id: 'CRU', lvl: 1}]))
}