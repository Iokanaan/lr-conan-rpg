import { WeaponData } from "../types/weaponTypes"
import { WeaponEditComponent } from "./weaponEditComponent"
import { WeaponViewComponent } from "./weaponViewComponent"

export class WeaponComponent {
    
    private editCmp: WeaponEditComponent
    private viewCmp: WeaponViewComponent

    constructor(weaponCmp: Component<WeaponData>) {
        this.editCmp = new WeaponEditComponent(weaponCmp)
        this.viewCmp = new WeaponViewComponent(weaponCmp)
    }
}