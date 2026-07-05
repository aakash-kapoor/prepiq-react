import { createPortal } from 'react-dom';
import Spinner from './Spinner';
interface DeleteAccountModalProps {
    open: boolean;
    deleting: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}
export default function DeleteAccountModal({
    open,
    deleting,
    onCancel,
    onConfirm,
}: DeleteAccountModalProps) {
    if (!open) return null;
    return createPortal(
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fadeIn"
            onClick={() => !deleting && onCancel()}
        >
            <div
                className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5 transform animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5 text-red-500 dark:text-red-400"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                            />
                        </svg>
                    </div>
                    <div className="space-y-1 pt-1">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            Delete your account?
                        </h3>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                            All of your data will be lost — job applications, extracted
                            questions, weak spot tracking, and study plans. This action
                            cannot be undone.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 pt-1">
                    <button
                        onClick={onCancel}
                        disabled={deleting}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={deleting}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {deleting ? (
                            <>
                                <Spinner size="sm" colorClass="text-white" />
                                Deleting...
                            </>
                        ) : (
                            'Delete My Account'
                        )}
                    </button>
                </div>
            </div>
        </div>
        , document.body);
}