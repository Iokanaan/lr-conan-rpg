import { WeaponData } from "../types/weaponTypes";

export class WeaponViewComponent {
    
    private entryCmp: Component<WeaponData>

    constructor(entryCmp: Component<WeaponData>) {
        this.entryCmp = entryCmp
    }
}