import { rollSkill } from "../../diceroll/business/roll"
import { intToChar } from "../../util/utils"
import { WeaponRepeater } from "../component/weaponRepeater"
import { Quality, WeaponData, WeaponWielding, weaponWieldingsInt } from "../types/weaponTypes"
import { getLabel } from "../utils/qualityUtils"

export const chargeMoinsHandler = function(repeater: WeaponRepeater): (elem: Component<unknown>) => void {
    return function(elem: Component<unknown>) {
        const entry = repeater.find(elem.index())
        const data = repeater.value()[elem.index()]
        if(data.charges_Input > 0) {
            entry.find("charges_Input").value(data.charges_Input - 1)
            entry.find("charges_Display_Label").value(entry.find("charges_Input").value())
        }
    }
} 

export const chargePlusHandler = function(repeater: WeaponRepeater): (elem: Component<unknown>) => void {
    return function(elem: Component<unknown>) {
        const entry = repeater.find(elem.index())
        const data = repeater.value()[elem.index()]
        if(data.charges_Input === undefined) {
            data.charges_Input = 0
        }
        entry.find("charges_Input").value(data.charges_Input + 1)
        entry.find("charges_Display_Label").value(entry.find("charges_Input").value())
    }
} 

export const wieldingHandler = function(repeater: WeaponRepeater): (elem: Component<unknown>) => void {
    return function(elem: Component<unknown>) {
        const entry = repeater.find(elem.index())
        const data = repeater.value()[elem.index()]
        // Autoriser le changement passage changement de maniement pour les armes à deux main et les déséquilibrées
        let weaponWieldingId = entry.find('wielding_Choice').value()
        switch (data.size_Choice) {
            case 'deuxMains':
                // Bloquer le passage à une main pour les armes à distances. 
                // Rien n'est spécifié dans les règles, mais un arc à une main...
                if(data.type_Choice === "ranged") { break }
            case 'desequilibree':
                weaponWieldingId = (weaponWieldingId === "uneMain") ? "deuxMains" : "uneMain"
            default:
        }
        // Mettre a jour tous les inputs associés
        const weaponWielding: WeaponWielding  = Tables.get("weapon_wieldings").get(weaponWieldingId)
        entry.find('wielding_Choice').value(weaponWielding.id)
        elem.value(weaponWielding.type)
        entry.find('wielding_Choice_as_Int').value(weaponWieldingsInt[weaponWielding.id])
    }
}

export const attackHandler = function(weaponRepeater: WeaponRepeater): (elem: Component<unknown>) => void {
    return function(elem: Component<unknown>) {
        const data = weaponRepeater.value()[elem.index()]
        const entry = weaponRepeater.find(elem.index())
        const talents: string[] = [] 
        each<TalentData>(weaponRepeater.sheet().get('talents').value(), function(talent) {
            talents.push(talent.talents_Choice)
        }) 
        // Initialiser les metadonnees de l'attaque
        const tags = processQualitiesTag(data)
        data.damage_Input = (data.damage_Input !== undefined) ? data.damage_Input : 0
        if(data.type_Choice === "melee") {
            const damage = data.damage_Input + weaponRepeater.sheet().get('melee_bonus').value()
            tags.push("d__" + intToChar(damage))
            // Jet simple sur la base de la melée pour les armes de corps à corps
            rollSkill(weaponRepeater.sheet() as Sheet<CharData>, Tables.get("skills").get("MEL"), tags)
        } else {

            const damage = data.damage_Input + weaponRepeater.sheet().get('ranged_bonus').value()
            
            // Gestion des charges pour les armes à distance
            const volee = data.qualities_Choice.includes("VOL")
            const charges = data.charges_Input > 0

            // ERREUR : Pas de charge
            if(!volee && !charges) {
                weaponRepeater.sheet().prompt('Erreur', 'GenericPrompt',function(){}, function(promptSheet: Sheet<YesNoData>) {
                    promptSheet.get("message").value("Aucune charge disponible")
                })
            }
    
            // On décrémente les charges
            if(!volee && charges) {
                entry.find('charges_Input').value(data.charges_Input - 1)
                entry.find("charges_Display_Label").value(entry.find("charges_Input").value())
                tags.push("d__" + intToChar(damage))
                rollSkill(weaponRepeater.sheet() as Sheet<CharData>, Tables.get("skills").get("DIST"), tags)
            }
    
            // On lance une attaque normale
            if(volee && !charges) {
                tags.push("d__" + intToChar(damage))
                rollSkill(weaponRepeater.sheet() as Sheet<CharData>, Tables.get("skills").get("DIST"), tags)
            }
    
            // On lance avec bonus, on décrémente les charges
            if(volee && charges) {
                weaponRepeater.sheet().prompt('Consommer charge ?', 'ChargePrompt', function(result) {
                    tags.push("d__" + intToChar(damage + parseInt(result.yesno)))
                    entry.find('charges_Input').value(data.charges_Input - parseInt(result.yesno))
                    entry.find("charges_Display_Label").value(entry.find("charges_Input").value())
                    rollSkill(weaponRepeater.sheet() as Sheet<CharData>, Tables.get("skills").get("DIST"), tags)
                }, function(promptSheet: Sheet<YesNoData>) {
                    if(talents.includes("TIRRAP") && data.charges_Input >= 2) {
                        (promptSheet.get("yesno") as ChoiceComponent).setChoices({"0":"0", "1":"1", "2":"2"})
                    }
                })
            }
        }
    }
}

export const throwHandler = function(repeater: WeaponRepeater): (elem: Component<unknown>) => void {
    return function(elem) {
        const data = repeater.value()[elem.index()]
        data.damage_Input = (data.damage_Input !== undefined) ? data.damage_Input : 0 
        const tags = processQualitiesTag(data)
        tags.push("d_" + intToChar(data.damage_Input))
        rollSkill(repeater.sheet() as Sheet<CharData>, Tables.get("skills").get("DIST"), tags)
    }
}

const processQualitiesTag = function(data: WeaponData) {
    return data.qualities_Choice.map(function(selectedQuality) {
        const quality = Tables.get("weapon_qualities").get(selectedQuality) as Quality
        if(quality.type === "Variable") {
            if(data[getLabel(quality.id)] === undefined) {
                data[getLabel(quality.id)] = 1
            }
            // Sale, les tags ne peuvent pas contenir de chiffre, on doit compter avec des lettres
            return "q_" + quality.id + "_" + intToChar(data[getLabel(quality.id)] !== undefined ? data[getLabel(quality.id)] as number : 1)
        }
        return "q_" + quality.id
    })
}