import { SkillId } from "../../skill/types/skillData"

export type TalentId = 'AGI' | 'AGIFEL' | 'MESS'
export type Talent = {
    id: TalentId
    name: string
    description: string
    skill: SkillId
    level: number
    prerequisite: string
}