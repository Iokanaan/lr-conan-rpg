import { setupRepeater } from "../../util/utils"
import { attackHandler, chargeMoinsHandler, chargePlusHandler, throwHandler, wieldingHandler } from "../business/weaponRepeater"
import { WeaponData } from "../types/weaponTypes"
import { WeaponEditEntry } from "./weaponEditEntry"

export interface WeaponRepeater extends Component<Record<string, WeaponData>> {
    setListeners: () => WeaponRepeater
}

export const WeaponRepeater = function (this: WeaponRepeater) {
    this.setListeners = function() {
        // Gestion de l'initialisation du mode édition
        setupRepeater(this, function(entry) {
            WeaponEditEntry
                .call(entry)
                .setDefaultData()
                .setListeners()
        })
        // Gestion des stocks de recharges
        this.on('click', 'charge_moins', chargeMoinsHandler(this))
        this.on('click', 'charge_plus', chargePlusHandler(this))

        // Gestion des mains
        this.on('click', 'wielding', wieldingHandler(this))

        // Lancer une attaque si click sur l'arme
        this.on('click', 'weaponName', attackHandler(this))

        // Gestion du jet d'armes de corps à corps
        this.on('click', 'throw', throwHandler(this))
        return this
    }
    return this
} as any as { (): WeaponRepeater }

        //  this.on('click', function(repeater: Component<Record<string, WeaponData>>) {
        //     each(repeater.value(), function (_, entryId) {
        //         const entry = repeater.find(entryId)
        //         if(entry.find('mode').value() === 'EDIT') {
        //             // On init uniquement les entries qui n'était pas en mode EDIT avant
        //             if(entryStates[entryId] !== 'EDIT') {
        //                 // Initialisation de l'entry
        //                 WeaponEditEntry
        //                     .call(entry)
        //                     .setDefaultData()
        //                     .setListeners()
        //             }
        //             // L'entry est stockée en mode EDIT
        //             entryStates[entryId] = 'EDIT'
        //         } else {
        //             // L'entry est stockée en mode VIEW
        //             entryStates[entryId] = 'VIEW'  
        //         }
        //     })
        // })