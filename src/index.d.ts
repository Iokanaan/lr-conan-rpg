//@ts-check

import { LrEvent } from "./EventHandler";
import { WeaponSizeId } from "./weapons/weaponSize";
import { WeaponWieldingId } from "./weapons/wielding"

declare global { 
    type LrId = WeaponQualityId | WeaponTypeId | WeaponSizeId | WeaponWieldingId
    type WeaponTypeId = 'melee' | 'ranged';
    type WeaponQualityId = 'AVE' | 'BOU_X' | 'JET';

    declare const each: <T>(c: Record<string, T>, f: (i: T, eid: string) => void) => vois;

    declare const Tables: Table;
        interface Table {
        get(id:string): LrObject
    }

    interface LrObject {
        each(f:(a: any) => void);
        get<T>(s:string): T;
    }

    type QualityInputName = string

    type WeaponQualityInputLabel =  `${WeaponQualityId}_Input`

    type WeaponQualityInputData = {
        [K in WeaponQualityInputLabel]?: number
    }

    type WeaponData = WeaponQualityInputData & {
        type_Choice_as_Int: number
        throwable_as_Int: number
        qualities_Input: string
        qualities_Choice: WeaponQualityId[]
        type_Choice: WeaponTypeId
        size_Choice: WeaponSizeId
    }

    type YesNoData = {
        yesno: boolean
    }

    type TalentData = {
        talents_Choice: string
    }

    interface Component<T = unkown > {
        show():void
        hide(): void
        value():T,
        value(val: T): void
        find(elem: 'talents'): Component<TalentData>,
        find(elem: string): Component,
        on(type: string, handler: (event: LrEvent) => void)
        on(type: string, delegate: string, handler: (event: LrEvent) => void)
        index(): string
    }

    interface ChoiceComponent<T = unknown> extends Component<T> {
        setChoices(data: Record<string, string>)
    }

    interface Sheet {
        get(elem: 'talents'): Record<string, T>,
        get(s:string):Component;
        setData(data: Partial<Data>)
        getData(): Data;
        prompt(title: string, sheetId: string, callback: (result: componentData) => void, callbackInit: (sheet: Sheet) => void)
    }
} 
export {}
