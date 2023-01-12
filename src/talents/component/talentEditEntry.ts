import { getAvailableChoices } from "../business/talentEditEntry"



export interface TalentEditEntry extends Component<TalentData> {
    setDefaultData: () => TalentEditEntry
    setListeners: () => TalentEditEntry
}

export const TalentEditEntry = function (this: TalentEditEntry) {

    this.setDefaultData = function() {
        const availableChoices = getAvailableChoices((this.sheet() as Sheet<CharData>).getData());
        (this.find("talents_Choice") as ChoiceComponent).setChoices(availableChoices)
        const that = this
        log("entry val")
        log(that.find('talents_Choice').value())
       /* each(availableChoices, function(_, key) {
            that.find('talents_Choice').value(key)
            that.find('talent_desc').value(Tables.get('talents').get(key).description)
            return false
        })*/
        const talentSkill = Tables.get("talents").get(this.value().talents_Choice).skill
        switch (talentSkill) {
            case "ORIG":
                this.find("talent_skill").text("Origine")
                break
            case "CAST":
                this.find("talent_skill").text("Caste")
                break
            default:
                this.find("talent_skill").text(Tables.get("skills").get(talentSkill).name)
        }

        return this
    }

    this.setListeners = function() {
        const that = this
        // Afficher les valeurs de qualités nécessaires et mettre à jour la liste des qualités à l'update sur les checkbox
        this.find("talents_Choice").on("update", function(target) {
            const talent = Tables.get("talents").get(target.value())
            that.find("talent_desc").value(talent.description)
            that.find("talent_skill").value(Tables.get("skills").get(talent.skill).name)
            that.find("talent_name").value(talent.name)
        })
        return this
    }

    return this

} as any as { (): TalentEditEntry }

