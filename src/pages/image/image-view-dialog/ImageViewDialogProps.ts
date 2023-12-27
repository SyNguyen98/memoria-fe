import {Item} from "../../../models/Item";

export interface ImageViewDialogProps {
    open: boolean;
    onClose: () => void;
    items: Item[];
    itemIndex: number;
}
