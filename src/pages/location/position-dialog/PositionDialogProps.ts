export interface PositionDialogProps {
    open: boolean;
    onClose: () => void;
    setPosition: (lat: number, lng: number) => void;
}
