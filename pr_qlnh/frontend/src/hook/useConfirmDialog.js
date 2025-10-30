import { useContext } from "react";
import { ConfirmContext } from "../context/ConfirmProvider";


export const useConfirmDialog = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error("useConfirmDialog must be used within a ConfirmProvider");
    }
    return context;
};
