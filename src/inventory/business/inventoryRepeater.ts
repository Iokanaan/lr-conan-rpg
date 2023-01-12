import { InventoryRepeater } from "../component/inventoryRepeater"

export const qteMoinsHandler = function(repeater: InventoryRepeater): (elem: Component<unknown>) => void {
    return function(elem: Component<unknown>) {
        const entry = repeater.find(elem.index())
        const data = repeater.value()[elem.index()]
        if(data.qte_Input > 0) {
            entry.find("qte_Input").value(data.qte_Input - 1)
            entry.find("qte_Label").value(entry.find("qte_Input").value())
        }
    }
} 

export const qtePlusHandler = function(repeater: InventoryRepeater): (elem: Component<unknown>) => void {
    return function(elem: Component<unknown>) {
        const entry = repeater.find(elem.index())
        const data = repeater.value()[elem.index()]
        if(data.qte_Input === undefined) {
            data.qte_Input = 0
        }
        entry.find("qte_Input").value(data.qte_Input + 1)
        entry.find("qte_Label").value(entry.find("qte_Input").value())
    }
} 
