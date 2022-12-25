import { WeaponData } from "../types/weaponData";

export class WeaponViewComponent {
    
    private entryCmp: Component<WeaponData>

    constructor(entryCmp: Component<WeaponData>) {
        this.entryCmp = entryCmp
    }
}