import React, { useState, useCallback } from "react";
import ConfirmContext from "./ConfirmContext";
import ConfirmDialog from "../components/ConfirmDialog/ConfirmDialog";

const ConfirmProvider = ({ children }) => {
    const [confirmState, setConfirmState] = useState({
        open: false,
        message: "",
        title: "",
        resolve: null,
    });

    const confirm = useCallback((message, title = "Xác nhận") => {
        return new Promise((resolve) => {
            setConfirmState({ open: true, message, title, resolve });
        });
    }, []);

    const handleConfirm = () => {
        confirmState.resolve(true);
        setConfirmState((prev) => ({ ...prev, open: false }));
    };

    const handleCancel = () => {
        confirmState.resolve(false);
        setConfirmState((prev) => ({ ...prev, open: false }));
    };

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            <ConfirmDialog
                open={confirmState.open}
                title={confirmState.title}
                message={confirmState.message}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </ConfirmContext.Provider>
    );
};

export default ConfirmProvider;
