interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    /** Tailwind text-color class controlling the spinner's stroke color */
    colorClass?: string;
}

const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-9 h-9 border-[3px]',
};

export default function Spinner({ size = 'md', colorClass = 'text-[#6366F1]' }: SpinnerProps) {
    return (
        <span
            role="status"
            aria-label="Loading"
            className={`inline-block shrink-0 ${sizeMap[size]} ${colorClass} rounded-full border-current border-t-transparent animate-spin`}
        />
    );
}
