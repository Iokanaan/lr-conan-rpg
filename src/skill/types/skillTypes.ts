export type AttributeId = 'AGI' | 'PERC' | 'CON' | 'COO' | 'INT' | 'PERS' | 'VOLO'
export type SkillId = 'ACR' | 'MEL' | 'FUR' | 'INTU' | 'OBS' | 'SUR' | 'VOL' | 'ATH' | 'RES' | 'PAR' | 'DIST' | 'NAV' | 'ALC' | 'ART' | 'SOI' | 'LIN' | 'CUL' | 'GUE' | 'DRE' | 'COM' | 'CONS' | 'PERSU' | 'SOC' | 'DIS' | 'SOR'
export type SkillExpInputName = `${SkillId}_Exp_Inpt`
export type SkillConcInputName = `${SkillId}_Conc_Inpt`
export type AttributeInputName = `${AttributeId}_Inpt`

type SkillConcInput = {
    [K in SkillConcInputName]: number
}

type SkillExpInput = {
    [K in SkillExpInputName]: number
}

type AttributeInput = {
    [K in AttributeInputName]: number
}

export type SkillData = SkillConcInput & SkillExpInput & AttributeInput

export type Skill = {
    id: SkillId
    name: string
    attribute: AttributeId
}