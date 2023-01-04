import { WeaponData } from "../types/weaponTypes";

export class WeaponRepeater {

    private sheet: Sheet<CharData>
    //private entries: Record<string, WeaponData>

    constructor(sheet: Sheet<CharData>) {
        this.sheet = sheet
        sheet.get('weapons').value().forEach(function(entry: WeaponData) {
            log(entry)
        })
    }
}