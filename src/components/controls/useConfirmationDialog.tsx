import { useCallback, useRef, useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";

function useConfirmationDialog() {
    const callback = useRef<((confirmed: boolean) => void) | null>(null);
    const [dialogProps, setDialogProps] = useState({ open: false, title: '' });

    const prompt = useCallback((title: string, cb: (confirmed: boolean) => void) => {
        callback.current = cb
        setDialogProps({ open: true, title });
    }, []);

    const handleClose = useCallback(() => {
        setDialogProps({ ...dialogProps, open: false });
        if (callback.current !== null) callback.current(false);
    }, [callback, dialogProps]);

    const handleConfirm = useCallback(() => {
        setDialogProps({ ...dialogProps, open: false });
        if (callback.current !== null) callback.current(true);
    }, [callback, dialogProps]);

    const Dialog = (
        <ConfirmationDialog
            {...dialogProps}
            onClose={handleClose}
            onConfirm={handleConfirm}
        />
    );

    return [Dialog, prompt] as const;
}

export default useConfirmationDialog