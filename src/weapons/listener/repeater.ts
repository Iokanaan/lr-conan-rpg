// Initalisation d'une entry du repeater des armes
import { setRepeaterQualityInputs, variableQualities, handleRepeaterQualityChoice, getLabel, Quality } from './qualities'
import { handleChargeMoins, handleChargePlus, setRepeaterCharges } from './charges'
import { LrEvent } from '../EventHandler'
import { handleWielding, handleWeaponChoiceRepeater, WeaponSizeId } from './wielding'
import { rollComp } from "../diceroll/diceroll"

// Variable globale de gestion des entries sur le repeater des armes
let globalWeaponEntryStates: Record<string, 'EDIT' | 'VIEW'> = {}

// Initialisation du repeater des armes
export const initWeaponsRepeater = function(sheet: Sheet) {

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
       
    })

    // Gestion du jet d'armes de corps à corps
    sheet.get("weapons").on("click", "throw", function(component) {
        const entryData = sheet.get("weapons").value()[component.index()]
        entryData.damage_Input = (entryData.damage_Input !== undefined) ? entryData.damage_Input : 0 
        const tags = processQualitiesTag(entryData)
        tags.push("attack")
        tags.push("d_" + intToLetter(entryData.damage_Input))
        rollComp(sheet, Tables.get("skills").get("DIST"), tags)
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
    variableQualities.forEach(function(quality) {
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

const processQualitiesTag = function(data: WeaponData) {
    return data.qualities_Choice.map(function(selectedQuality) {
        const quality = Tables.get("weapon_qualities").get(selectedQuality) as Quality
        if(quality.type === "Variable") {
            if(data[getLabel(quality.id)] === undefined) {
                data[getLabel(quality.id)] = 1
            }
            // Sale, les tags ne peuvent pas contenir de chiffre, on doit compter avec des lettres
            return "q_" + quality.id.replace( "_X", "_" + intToLetter(data[getLabel(quality.id)] ?? 1))
        }
        return "q_" + quality.id
    })
}

const letterToInt = function(letter: string) {
    return letter.charCodeAt(0) - 96
}

const intToLetter = function(n: number) {
    return String.fromCharCode(96 + n)
}
