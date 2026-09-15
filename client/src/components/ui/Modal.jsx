import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from './Button';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className="absolute inset-0 bg-black/50 animate-[fadeIn_0.15s_ease-out]"
                onClick={onClose}
            />
            <div
                className={`relative w-full ${maxWidth} bg-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col animate-[fadeSlideUp_0.15s_ease-out]`}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 id="modal-title" className="text-base font-semibold text-gray-900">{title}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close modal">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="overflow-y-auto flex-1 px-6 py-4">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export { Modal };