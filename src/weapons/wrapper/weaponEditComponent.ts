import { WeaponData } from "../types/weaponTypes";

export class WeaponEditComponent {
    
    private entryCmp: Component<WeaponData>

    constructor(entryCmp: Component<WeaponData>) {
        this.entryCmp = entryCmp
    }
}