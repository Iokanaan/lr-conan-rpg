export const handleAttack = function(sheet: Sheet, component: Component) {
    const entryData = sheet.get("weapons").value()[component.index()]
    const entryCmp = sheet.get("weapons").find(component.index())
    const talents: string[] = [] 
    each<TalentData>(sheet.get("talents").value(), function(talent) {
        talents.push(talent.talents_Choice)
    }) 
    // Initialiser les metadonnees de l'attaque
    const tags = processQualitiesTag(entryData)
    tags.push("attack")
    entryData.damage_Input = (entryData.damage_Input !== undefined) ? entryData.damage_Input : 0
    tags.push("d_" + intToLetter(entryData.damage_Input))
    if(entryData.type_Choice === "melee") {
        // Jet simple sur la base de la melée pour les armes de corps à corps
        rollComp(sheet, Tables.get("skills").get("MEL"), tags)
    } else {
        // Gestion des charges pour les armes à distance
        if(entryData.charges_Input === undefined) { entryData.charges_Input = 0 }
        const volee = entryData.qualities_Choice.includes("VOL")
        const charges = entryData.charges_Input > 0
        // ERREUR : Pas de charge
        if(!volee && !charges) {
            sheet.prompt('Erreur', 'GenericPrompt',function(){}, function(promptSheet: Sheet) {
                promptSheet.get("message").value("Aucune charge disponible")
            })
        }

        // On décrémente les charges
        if(!volee && charges) {
            entryCmp.find('charges_Input').value(entryData.charges_Input - 1)
            entryCmp.find("charges_Display_Label").value(entryCmp.find("charges_Input").value())
            rollComp(sheet, Tables.get("skills").get("DIST"), tags)
        }

        // On lance une attaque normale
        if(volee && !charges) {
            rollComp(sheet, Tables.get("skills").get("DIST"), tags)
        }

        // On lance avec bonus, on décrémente les charges
        if(volee && charges) {
            sheet.prompt('Consommer charge ?', 'ChargePrompt', function(result) {
                tags.push("v_" + result.yesno)
                entryCmp.find('charges_Input').value(entryData.charges_Input - parseInt(result.yesno))
                entryCmp.find("charges_Display_Label").value(entryCmp.find("charges_Input").value())
                rollComp(sheet, Tables.get("skills").get("DIST"), tags)
            }, function(promptSheet: Sheet) {
                if(talents.includes("TIRRAP") && entryData.charges_Input >= 2) {
                    (promptSheet.get("yesno") as ChoiceComponent).setChoices({"0":"0", "1":"1", "2":"2"})
                }
            })
        }
    }
}