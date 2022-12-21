// Initalisation d'une entry du repeater des armes
import { setRepeaterQualityInputs, variableQualities, handleRepeaterQualityChoice, getLabel, processQualitiesTag } from '../business/qualities'
import { handleChargeMoins, handleChargePlus, setRepeaterCharges } from '../business/charges'
import { handleWielding, handleWeaponChoiceRepeater } from '../business/wielding'
import { Quality, WeaponData, WeaponQualityId, WeaponSizeId, WeaponTypeId } from '../types/weaponData'
import { intToLetter } from '../../util/utils'
import { handleAttack, handleThrow } from '../business/attack'

// Variable globale de gestion des entries sur le repeater des armes
let globalWeaponEntryStates: Record<string, 'EDIT' | 'VIEW'> = {}

// Initialisation du repeater des armes
export const initWeaponsRepeater = function(sheet: Sheet<CharData>) {

    // Gestion de l'initialisation du mode édition
    sheet.get("weapons").on("click", function(repeater: Component<Record<string, WeaponData>>) {
        each(repeater.value(), function (entryData, entryId) {
            const entryCmp = repeater.find(entryId)
            if(entryCmp.find("mode").value() === "EDIT") {
                // On init uniquement les entries qui n'était pas en mode EDIT avant
                if(globalWeaponEntryStates[entryId] !== "EDIT") {
                    // Initialisation de l'entry
                    initRepeaterEditWeapon(entryCmp)
                }
                // L'entry est stockée en mode EDIT
                globalWeaponEntryStates[entryId] = "EDIT"
            } else {
                // L'entry est stockée en mode VIEW
                globalWeaponEntryStates[entryId] = "VIEW"  
            }
        })
    })

    // Gestion des stocks de recharges
    sheet.get("weapons").on("click", "charge_moins", function(component: Component){
        handleChargeMoins(sheet, component)
    })

    sheet.get("weapons").on("click", "charge_plus", function(component: Component) {
        handleChargePlus(sheet, component)
    })

    // Gestion des mains
    sheet.get("weapons").on('click', 'wielding', function(component: Component) {
        handleWielding(sheet, component)
    })

    // Lancer une attaque si click sur l'arme
    sheet.get("weapons").on("click", "weaponName", function(component: Component<string[]>) {
        handleAttack(sheet, component)
    })

    // Gestion du jet d'armes de corps à corps
    sheet.get("weapons").on("click", "throw", function(component: Component) {
        handleThrow(sheet, component)
    })
}


const initRepeaterEditWeapon = function(entryCmp: Component<WeaponData>) {
    const selectedQualities = entryCmp.value().qualities_Choice
    // Set les inputs de valeurs de qualité à l'initialisation
    setRepeaterQualityInputs(entryCmp, selectedQualities)
    // Set les inputs de charges pour les armes à distance à l'initialisation
    setRepeaterCharges(entryCmp, entryCmp.value().type_Choice)

    // Afficher les valeurs de qualités nécessaires et mettre à jour la liste des qualités à l'update sur les checkbox
    entryCmp.find("qualities_Choice").on("update", function(target: LrEvent<WeaponQualityId[]>) { handleRepeaterQualityChoice(entryCmp, target) })
    // Update la iste des qualités à l'update des valeurs sur les qualités
    variableQualities.forEach(function(quality: Quality) {
        entryCmp.find(getLabel(quality.id)).on('update', function(target: LrEvent<WeaponQualityId[]>) { handleRepeaterQualityChoice(entryCmp, target) })
    })
    // Toggle l'affichage des munitions
    entryCmp.find("type_Choice").on("update", function(target: LrEvent<WeaponTypeId>) {
        setRepeaterCharges(entryCmp, target.value())
    })
    // Set size choice as int
    // Update wielding choice accordingly
    entryCmp.find("size_Choice").on("update", function(target: LrEvent<WeaponSizeId>) {
        handleWeaponChoiceRepeater(entryCmp, target)
    })
}