import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

const Pagination = ({ page, pages, total, limit, onPageChange }) => {
    if (pages <= 1) return null;

    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    const getPageNumbers = () => {
        const pages_arr = [];
        const delta = 2;
        for (let i = Math.max(1, page - delta); i <= Math.min(pages, page + delta); i++) {
            pages_arr.push(i);
        }
        if (pages_arr[0] > 1) {
            if (pages_arr[0] > 2) pages_arr.unshift('...');
            pages_arr.unshift(1);
        }
        if (pages_arr[pages_arr.length - 1] < pages) {
            if (pages_arr[pages_arr.length - 1] < pages - 1) pages_arr.push('...');
            pages_arr.push(pages);
        }
        return pages_arr;
    };

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{start}</span> to <span className="font-medium">{end}</span> of <span className="font-medium">{total}</span> results
            </p>
            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                {getPageNumbers().map((p, i) =>
                    p === '...'
                        ? <span key={`ellipsis-${i}`} className="px-2 text-gray-400">...</span>
                        : (
                            <Button
                                key={p}
                                variant={p === page ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => onPageChange(p)}
                                aria-current={p === page ? 'page' : undefined}
                            >
                                {p}
                            </Button>
                        )
                )}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === pages}
                    aria-label="Next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export { Pagination };
