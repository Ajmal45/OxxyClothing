const PageHeader = ({ title, description, action }) => (
    <div className="flex items-start justify-between mb-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
        {action && <div className="ml-4 flex-shrink-0">{action}</div>}
    </div>
);

const FormSection = ({ title, description, children }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
        {(title || description) && (
            <div className="mb-5 pb-4 border-b border-gray-100">
                {title && <h3 className="text-sm font-semibold text-gray-900">{title}</h3>}
                {description && <p className="mt-0.5 text-sm text-gray-500">{description}</p>}
            </div>
        )}
        {children}
    </div>
);

const StatCard = ({ label, value, icon: Icon, trend, description }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            {Icon && (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                    <Icon className="h-4 w-4 text-gray-600" />
                </div>
            )}
        </div>
        <p className="text-3xl font-bold text-gray-900 tabular-nums">{value ?? '—'}</p>
        {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
    </div>
);

export { PageHeader, FormSection, StatCard };
