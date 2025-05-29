import { createContext, useContext, useState, ReactNode } from "react";

type EditAccountContextType = {
    field: string | null;
    value: string | null;
    setFieldValue: (field: string, value: string) => void;
    clearFieldValue: () => void;
};

const EditAccountContext = createContext<EditAccountContextType | null>(null);

type EditAccountProviderProps = {
    children: ReactNode;
};

export const EditAccountProvider = ({ children }: EditAccountProviderProps) => {
    const [field, setField] = useState<string | null>(null);
    const [value, setValue] = useState<string | null>(null);

    const setFieldValue = (f: string, v: string) => {
        setField(f);
        setValue(v);
    };

    const clearFieldValue = () => {
        setField(null);
        setValue(null);
    }

    return (
        <EditAccountContext.Provider value={{ field, value, setFieldValue, clearFieldValue }}>
            {children}
        </EditAccountContext.Provider>
    );
};

export const useEditAccount = () => {
    const context = useContext(EditAccountContext);
    if (!context) throw new Error('useEditAccount must be used within an EditAccountProvider');
    return context;
};
