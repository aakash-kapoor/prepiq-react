import toast, { type ToastOptions } from 'react-hot-toast';

const baseOptions: ToastOptions = {
    duration: 4000,
    style: {
        background: '#FFFFFF',
        color: '#0F172A',
        fontSize: '12px',
        fontWeight: 600,
        padding: '12px 16px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.08)',
        border: '1px solid #F1F5F9',
        maxWidth: '380px',
    },
};

export const showSuccessToast = (message: string) =>
    toast.success(message, {
        ...baseOptions,
        iconTheme: { primary: '#10B981', secondary: '#FFFFFF' },
        style: { ...baseOptions.style, border: '1px solid #D1FAE5' },
    });

export const showErrorToast = (message: string) =>
    toast.error(message, {
        ...baseOptions,
        duration: 5000,
        iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' },
        style: { ...baseOptions.style, border: '1px solid #FEE2E2' },
    });

export const showLoadingToast = (message: string) =>
    toast.loading(message, {
        ...baseOptions,
        iconTheme: { primary: '#6366F1', secondary: '#FFFFFF' },
        style: { ...baseOptions.style, border: '1px solid #E0E7FF' },
    });

export const dismissToast = (id: string) => toast.dismiss(id);
