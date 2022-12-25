import { WeaponData } from "../types/weaponData";

export class WeaponEditComponent {
    
    private entryCmp: Component<WeaponData>

    constructor(entryCmp: Component<WeaponData>) {
        this.entryCmp = entryCmp
    }
}