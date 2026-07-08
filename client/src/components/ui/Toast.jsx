import { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

let toastId = 0;

const ICONS = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback(({ message, type = 'info', duration = 4000 }) => {
        const id = ++toastId;
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toast: addToast }}>
            {children}
            {createPortal(
                <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
                    <AnimatePresence>
                        {toasts.map((t) => (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, x: 60 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 60 }}
                                transition={{ duration: 0.2 }}
                                className="pointer-events-auto flex items-start gap-3 bg-white rounded-xl border border-gray-200 shadow-lg px-4 py-3"
                            >
                                <div className="flex-shrink-0 pt-0.5">{ICONS[t.type]}</div>
                                <p className="flex-1 text-sm text-gray-800">{t.message}</p>
                                <button
                                    onClick={() => removeToast(t.id)}
                                    className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                                    aria-label="Dismiss notification"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
