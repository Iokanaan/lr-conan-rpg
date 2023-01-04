// Weapon Data
export type WeaponData = WeaponQualityInputData & {
    type_Choice_as_Int: number
    throwable_as_Int: number
    qualities_Input: string
    qualities_Choice: WeaponQualityId[]
    type_Choice: WeaponTypeId
    size_Choice: WeaponSizeId
    size_Choice_as_Int: number
    wielding_Choice: WeaponWieldingId
    wielding_Choice_as_Int: number
    range_Choice: WeaponRangeId
    charges_Input: number,
    damage_Input: number
};

export type WeaponRangeId = '1' | '2' | '3' | '4' | '5' | 'C' | 'M' | 'L';

// Weapon types
export type WeaponTypeId = 'melee' | 'ranged'
export const weaponTypesInt: Record<WeaponTypeId, number> = {
    melee: 1,
    ranged: 2
}

// Weapon Qualities
export type WeaponQualityId = 'AVE' | 'BOU' | 'JET' | 'CRU' | 'CAV' | 'PERF' | 'CON' | 'ETEN' | 'CACH' | 'ETOU' 
| 'ETRE' | 'FRA' | 'IMP' | 'INC' | 'INT' | 'LET' | 'MAT' | 'NLET' | 'PAR' | 'PERS' | 'RED' | 'SUB' | 'VOL' | 'ZON';
export type WeaponQualityInputName = `${WeaponQualityId}_Input`
export interface Quality {
    id: WeaponQualityId
    name: string
    type: 'Fixe' | 'Variable'
}
type WeaponQualityInputData = { 
    [K in WeaponQualityInputName]?: number
}

// Weapon Sizes
export type WeaponSizeId = keyof typeof weaponSizesInt;
export const weaponSizesInt: Record<string, number> = {
    uneMain: 1,
    deuxMains: 2,
    desequilibree: 3,
    encombrante: 4,
    fixe: 5,
    monstrueuse: 6
}

// Weapon Wieldings
export type WeaponWieldingId = 'uneMain' | 'deuxMains';
export type WeaponWielding = {
    id: WeaponWieldingId
    type: string
}
export const weaponWieldingsInt: Record<WeaponWieldingId, number> = {
    uneMain: 1,
    deuxMains: 2
}

