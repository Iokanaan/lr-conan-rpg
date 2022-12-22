export type AttributeId = 'CON' | 'VOL'
export type SkillId = 'COO' | 'PERS' | 'ACR' | 'ALC' | 'DIST' | 'GUE'
export type SkillExpInputName = `${SkillId}_Exp_Inpt`
export type SkillConcInputName = `${SkillId}_Conc_Inpt`
export type AttributeInputName = `${AttributeId}_Inpt`

type SkillConcInput = {
    [K in SkillConcInputName]?: number
}

type SkillExpInput = {
    [K in SkillExpInputName]?: number
}

type AttributeInput = {
    [K in AttributeInputName]?: number
}

export type SkillData = SkillConcInput & SkillExpInput & AttributeInput

export type Skill = {
    id: SkillId
    name: string
    attribute: AttributeId
}