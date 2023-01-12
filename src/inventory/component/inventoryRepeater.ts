import { qteMoinsHandler, qtePlusHandler } from "../business/inventoryRepeater"
import { InventoryData } from "../types/inventoryTypes"

export interface InventoryRepeater extends Component<Record<string, InventoryData>> {
    setListeners: () => InventoryRepeater
}

export const InventoryRepeater = function (this: InventoryRepeater) {
    this.setListeners = function() {

        // Gestion des stocks
        this.on('click', 'qte_moins', qteMoinsHandler(this))
        this.on('click', 'qte_plus', qtePlusHandler(this))

        return this
    }
    return this
} as any as { (): InventoryRepeater }