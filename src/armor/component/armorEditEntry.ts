import { ArmorData } from "../types/ArmorTypes"

export interface ArmorEditEntry extends Component<ArmorData> {
    setDefaultData: () => ArmorEditEntry
    setListeners: () => ArmorEditEntry
}

export const ArmorEditEntry = function (this: ArmorEditEntry) {

    this.setDefaultData = function() {
        return this
    }

    this.setListeners = function() {
        const that = this

        // Afficher les valeurs de qualités nécessaires et mettre à jour la liste des qualités à l'update sur les checkbox
        this.find("qualities_Choice").on("update", function(target) {
            //that.find('qualities_Inpt').value(processQualitiesLabel(entryCmp.value()).join(", "))
        })
    
        this.find("coverage_Choice").on("update", function(target) {
            //that.find('coverage_Inpt').value(processQualitiesLabel(entryCmp.value()).join(", "))
        })
    
        // Toggle l'affichage des munitions
        this.find("type_Choice").on("update", function(target) {
            //that.find('type_Choice_as_Int').value(armorTypeInt[target.value()])
        })
    
        return this
    }

    return this

} as any as { (): ArmorEditEntry }