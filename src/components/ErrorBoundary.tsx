import { Component, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    /** Which visual variant to show when an error is caught */
    variant?: 'page' | 'section';
    /** Optional label shown in the fallback, e.g. "JD Analyzer" */
    label?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        // Swap this for Sentry / Datadog when you add error monitoring
        console.error('[PrepIQ ErrorBoundary]', error, info.componentStack);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (!this.state.hasError) return this.props.children;

        const { variant = 'section', label } = this.props;
        const title = label ? `${label} failed to load` : 'Something went wrong';

        /* ── Full-page fallback ── */
        if (variant === 'page') {
            return (
                <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
                    <div className="text-center max-w-md">
                        <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-7 h-7 text-red-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                        </div>
                        <h1 className="text-lg font-extrabold text-slate-900 tracking-tight mb-2">{title}</h1>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                            An unexpected error occurred. Try refreshing — if it keeps happening, check your connection or sign out and back in.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-[#6366F1] hover:bg-indigo-600 text-white text-xs font-bold px-6 py-3 rounded-xl transition shadow-sm shadow-indigo-500/20"
                            >
                                Reload page
                            </button>
                            <button
                                onClick={() => { window.location.href = '/'; }}
                                className="bg-white border border-gray-200 hover:bg-gray-50 text-slate-600 text-xs font-bold px-6 py-3 rounded-xl transition"
                            >
                                Back to home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        /* ── Inline section fallback ── */
        return (
            <div className="bg-white border border-red-100 rounded-2xl p-8 flex flex-col items-center text-center gap-3 shadow-sm">
                <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-red-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-900">{title}</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {label ? `The ${label} ran into an unexpected error.` : 'This section ran into an unexpected error.'}
                    </p>
                </div>
                <button
                    onClick={this.handleReset}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-4 py-2 rounded-xl transition mt-1"
                >
                    Try again
                </button>
            </div>
        );
    }
}
