import React, { createContext, useState, useContext, useCallback } from 'react';
import Alert from '~/components/Alert';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState(null);
    const showAlert = useCallback((message, options = {}) => {
        const { type = 'success', duration = 2000 } = options;
        const id = new Date().getTime();
        setAlert({ id, message, duration, type }); // Thêm 'type' vào state
    }, []);

    const closeAlert = () => {
        setAlert(null);
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            {alert && (
                <Alert
                    key={alert.id}
                    message={alert.message}
                    duration={alert.duration}
                    type={alert.type} // Truyền 'type' xuống component Alert
                    onClose={closeAlert}
                />
            )}
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    return useContext(AlertContext);
};