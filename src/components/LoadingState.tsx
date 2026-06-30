import Spinner from './Spinner';

interface LoadingStateProps {
    message?: string;
    /** 'block' fills its container (page/section loads), 'inline' sits next to text (buttons, small areas) */
    variant?: 'block' | 'inline';
    size?: 'sm' | 'md' | 'lg';
}

export default function LoadingState({
    message = 'Loading...',
    variant = 'block',
    size = 'lg',
}: LoadingStateProps) {
    if (variant === 'inline') {
        return (
            <span className="inline-flex items-center gap-2">
                <Spinner size="sm" />
                <span className="text-xs font-semibold text-slate-500">{message}</span>
            </span>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center gap-3 text-center p-12">
            <Spinner size={size} />
            <p className="text-xs font-semibold text-slate-400 tracking-wide">{message}</p>
        </div>
    );
}
