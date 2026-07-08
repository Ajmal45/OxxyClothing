import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    message,
    confirmLabel = 'Confirm',
    confirmVariant = 'danger',
    isLoading = false,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-sm text-gray-600 pt-2">{message}</p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={onClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button variant={confirmVariant} onClick={onConfirm} isLoading={isLoading}>
                    {confirmLabel}
                </Button>
            </div>
        </Modal>
    );
};

export { ConfirmDialog };
