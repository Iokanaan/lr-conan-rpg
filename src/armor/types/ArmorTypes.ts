export type ArmorQualityId = 'LOU' | 'BRU' | 'TROU'
export type ArmorQualityInputName = `${ArmorQualityId}_Input`
export interface ArmorQuality {
    id: ArmorQualityId
    name: string
}

export type ArmorData = {
    qualities_Choice: ArmorQuality[]
}
