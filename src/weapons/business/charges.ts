import { WeaponData, WeaponTypeId, weaponTypesInt } from "../types/weaponData"


// Toggle charges selon le type d'arme dans le craft
export const setCharges = function(sheet: Sheet<WeaponData>, weaponType: WeaponTypeId) {
    sheet.setData({
        type_Choice_as_Int: weaponTypesInt[weaponType]
    })
 
    if(weaponType === "ranged") {
        // Alimentation du champ integer pour les champs calculés
        sheet.get("charges_Input").show()
        sheet.get("charges_Label").show()
    } else {
        // Alimentation du champ integer pour les champs calculés
        sheet.get("charges_Input").hide()
        sheet.get("charges_Label").hide()
    }
}

// Toggle charges selon le type d'arme dans le repeater
export const setRepeaterCharges = function(entryCmp: Component<WeaponData>, weaponType: WeaponTypeId) {
    entryCmp.find('type_Choice_as_Int').value(weaponTypesInt[weaponType])
    if(weaponType === "ranged") {
        // Alimentation du champ integer pour les champs calculés
        entryCmp.find("charges_Input").show()
        entryCmp.find("charges_Label").show()
    } else {
        // Alimentation du champ integer pour les champs calculés
        entryCmp.find("charges_Input").hide()
        entryCmp.find("charges_Label").hide()
    }
}

export const handleChargeMoins = function(sheet: Sheet<CharData>, component: Component) {
    const entryCmp = sheet.get("weapons").find(component.index())
    const entryData = sheet.get("weapons").value()[component.index()]
    if(entryData.charges_Input > 0) {
        entryCmp.find("charges_Input").value(entryData.charges_Input - 1)
        entryCmp.find("charges_Display_Label").value(entryCmp.find("charges_Input").value())
    }
}

export const handleChargePlus = function(sheet: Sheet<CharData>, component: Component) {
    const entryCmp = sheet.get("weapons").find(component.index())
    const entryData = sheet.get("weapons").value()[component.index()]
    if(entryData.charges_Input === undefined) {
        entryData.charges_Input = 0
    }
    entryCmp.find("charges_Input").value(entryData.charges_Input + 1)
    entryCmp.find("charges_Display_Label").value(entryCmp.find("charges_Input").value())
}
