import { WeaponData, WeaponSizeId, weaponSizesInt, WeaponWielding, WeaponWieldingId, weaponWieldingsInt } from "../types/weaponData"

export const handleWielding = function(sheet: Sheet<CharacterData>, component: Component<string>) {
    const entryData = sheet.get("weapons").value()[component.index()]
    const entryCmp = sheet.get("weapons").find(component.index())
    // Autoriser le changement passage changement de maniement pour les armes à deux main et les déséquilibrées
    let weaponWieldingId = entryCmp.find('wielding_Choice').value()
    switch (entryData.size_Choice) {
        case 'deuxMains':
            // Bloquer le passage à une main pour les armes à distances. 
            // Rien n'est spécifié dans les règles, mais un arc à une main...
            if(entryData.type_Choice === "ranged") { break }
        case 'desequilibree':
            weaponWieldingId = (weaponWieldingId === "uneMain") ? "deuxMains" : "uneMain"
        default:
    }
    // Mettre a jour tous les inputs associés
    const weaponWielding: WeaponWielding  = Tables.get("weapon_wieldings").get(weaponWieldingId)
    entryCmp.find('wielding_Choice').value(weaponWielding.id)
    component.value(weaponWielding.type)
    entryCmp.find('wielding_Choice_as_Int').value(weaponWieldingsInt[weaponWielding.id])
}

export const handleWeaponChoiceRepeater = function(entryCmp: Component<WeaponData>, type: LrEvent<WeaponSizeId>) {
    entryCmp.find('size_Choice_as_Int').value(weaponSizesInt[type.value()])
    let wielding_Choice: WeaponWieldingId = "deuxMains"
    if(type.value() === "uneMain" || type.value() === "desequilibree") {
        wielding_Choice = "uneMain"
    }
    entryCmp.find('wielding_Choice').value(wielding_Choice)
    entryCmp.find('wielding_Choice_as_Int').value(weaponWieldingsInt[wielding_Choice])
}

export const handleWeaponChoiceCraft = function(sheet: Sheet<WeaponData>, target: LrEvent<WeaponSizeId>) {
    let wieldingChoice = "deuxMains"
    if(target.value() === "uneMain" || target.value() === "desequlibree") {
        wieldingChoice = "uneMain"
    }
    sheet.setData({
        size_Choice_as_Int : weaponSizesInt[target.value()],
        wielding_Choice : wieldingChoice,
        wielding_Choice_as_Int : weaponWieldingsInt[wieldingChoice]
    })
}
