import React, { useState } from 'react';

type ConfirmationDialogProps = {
    onClose: () => void;
    onConfirm: (data: any) => void;
    open: boolean
};

export type ButtonDialogProps = {
    onConfirm: (data: any) => void;
    dialog: React.ElementType<ConfirmationDialogProps>
    children: React.ReactElement<any>;
    dialogProps?: object
};

function ButtonDialog({ onConfirm, dialog: DialogComponent, children, dialogProps }: ButtonDialogProps) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = (data: any) => {
        onConfirm(data);
        handleClose();
    };

    return (
        <>
            {React.cloneElement(children, { onClick: handleOpen })}

            {open && (
                <DialogComponent {...dialogProps} onClose={handleClose} onConfirm={handleConfirm} open={open} />
            )}
        </>
    );
}

export default ButtonDialog;