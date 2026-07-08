import { AlertTriangle } from 'lucide-react';

const EmptyState = ({ icon: Icon, title, description, action }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        {Icon && (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 mb-4">
                <Icon className="h-7 w-7 text-gray-400" />
            </div>
        )}
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {description && <p className="mt-1 text-sm text-gray-500 max-w-sm">{description}</p>}
        {action && <div className="mt-4">{action}</div>}
    </div>
);

const ErrorState = ({ title = 'Something went wrong', description, onRetry }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {description && <p className="mt-1 text-sm text-gray-500 max-w-sm">{description}</p>}
        {onRetry && (
            <button
                onClick={onRetry}
                className="mt-4 text-sm font-medium text-black underline underline-offset-2"
            >
                Try again
            </button>
        )}
    </div>
);

export { EmptyState, ErrorState };
