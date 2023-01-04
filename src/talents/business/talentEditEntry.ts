import { SkillConcInputName, SkillExpInputName } from "../../skill/types/skillTypes"
import { Talent, TalentId } from "../types/talentTypes"

type PrerequisiteType = 'Tlt' | SkillExpInputName | SkillConcInputName

const checkPrerequisite = function(type: PrerequisiteType, condition: number | TalentId, currentTalents: TalentId[], sheetData: CharData): boolean {
    if(type === 'Tlt') {
        return currentTalents.includes(condition as TalentId)
    } else {
        return sheetData[type] >= condition 
    }
}

type Reduce = {
    reduceFunction: (prev: boolean, curr: boolean) => boolean
    initial: boolean
    splitStr: string
}

const buildReduce = function(prerequisiteStr: string): Reduce {
    if(prerequisiteStr.indexOf('||') !== -1) {
        return {
            reduceFunction: function(previous: boolean, current: boolean) {
                return previous || current
            },
            initial: false,
            splitStr: '||'
        }
    } else {
        return {
            reduceFunction: function(previous: boolean, current: boolean) {
                return previous && current
            },
            initial: true,
            splitStr: '&&'
        }
    }
}

const isTalentAvailable = function(sheetData: CharData, talent: Talent, currentTalents: TalentId[]) {
    if(talent.skill === 'ORIG' || talent.skill === 'CAST') {
        return false
    }

    if(talent.prerequisite === '') {
        return true
    }

    const reduce = buildReduce(talent.prerequisite)
    const prerequisiteArray = talent.prerequisite.split(reduce.splitStr)
    return prerequisiteArray.map(function(cond: string) {
        const condArray = cond.split('=')
        return checkPrerequisite(condArray[0] as PrerequisiteType, condArray[1] as TalentId | number, currentTalents, sheetData)
    }).reduce(reduce.reduceFunction, reduce.initial)
}

export const getAvailableChoices = function(sheetData: CharData): Partial<Record<TalentId, string>> {
    const availableChoices: Partial<Record<TalentId, string>> = {}
    const currentTalents: TalentId[] = []
    each(sheetData.talents, function(entryData: TalentData) {
        currentTalents.push(entryData.talents_Choice)
    })
    Tables.get('talents').each(function(talent) {
        if(isTalentAvailable(sheetData, talent, currentTalents)) {
            availableChoices[talent.id as TalentId] = talent.name
        }
    })
    return availableChoices
}
