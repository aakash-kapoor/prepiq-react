import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { deleteAllUserData } from '../lib/deleteUserData';
import DeleteAccountModal from '../components/DeleteAccountModal';
import Spinner from '../components/Spinner';
import { ProfileSkeleton } from '../components/Skeleton';
import { useMinLoadingDelay } from '../hooks/useMinLoadingDelay';
import {
    showSuccessToast,
    showErrorToast,
    showLoadingToast,
    dismissToast,
} from '../lib/toast';
import { ThemeToggle } from '../components/ThemeToggle';

export default function Profile() {
    const { user, updateDisplayName, reauthenticateWithGoogle, deleteAccount, logout } =
        useAuth();
    const navigate = useNavigate();

    const { loading, markDone, cancelTimer } = useMinLoadingDelay(600);

    useEffect(() => {
        if (user) {
            markDone();
        }
        return () => cancelTimer();
    }, [user, markDone, cancelTimer]);

    const [isEditingName, setIsEditingName] = useState(false);
    const [nameDraft, setNameDraft] = useState(user?.displayName ?? '');
    const [savingName, setSavingName] = useState(false);

    // Keep the draft in sync if displayName changes (e.g. after a successful save
    // the auth object updates and the old initial value would otherwise be stale).
    useEffect(() => {
        if (!isEditingName) {
            setNameDraft(user?.displayName ?? '');
        }
    }, [user?.displayName, isEditingName]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    if (loading) return <ProfileSkeleton />;
    if (!user) return null;

    const memberSince = user.metadata.creationTime
        ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : null;

    const handleSaveName = async () => {
        const trimmed = nameDraft.trim();
        if (!trimmed) {
            showErrorToast('Name cannot be empty.');
            return;
        }
        if (trimmed === user.displayName) {
            setIsEditingName(false);
            return;
        }
        if (!navigator.onLine) {
            showErrorToast('You must be online to update your profile name.');
            return;
        }
        setSavingName(true);
        try {
            await updateDisplayName(trimmed);
            showSuccessToast('Name updated.');
            setIsEditingName(false);
        } catch (err) {
            console.error('Failed to update display name:', err);
            showErrorToast('Could not update your name. Please try again.');
        } finally {
            setSavingName(false);
        }
    };

    const handleCancelEditName = () => {
        setNameDraft(user.displayName ?? '');
        setIsEditingName(false);
    };

    const handleConfirmDelete = async () => {
        if (!navigator.onLine) {
            showErrorToast('You must be online to delete your account.');
            setShowDeleteModal(false);
            return;
        }
        setDeleting(true);
        const toastId = showLoadingToast('Deleting your account...');
        try {
            // Firebase requires a recent sign-in before it will allow deletion.
            await reauthenticateWithGoogle();
            // Wipe Firestore data first — this needs an authenticated user.
            await deleteAllUserData(user.uid);
            // Now remove the auth account itself.
            await deleteAccount();

            dismissToast(toastId);
            showSuccessToast('Your account has been deleted.');
            navigate('/');
        } catch (err: any) {
            dismissToast(toastId);

            // User closed the Google re-auth popup — not a real error, just bail quietly.
            if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
                setShowDeleteModal(false);
                return;
            }

            setShowDeleteModal(false);
            console.error('Account deletion failed:', err);
            showErrorToast('Something went wrong deleting your account. Please try again.');
        } finally {
            // Always reset the deleting spinner — even if navigate() is delayed
            // or if an error was caught, so the modal/UI never stays stuck.
            setDeleting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    Profile
                </h1>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
                    Manage your account details.
                </p>
            </div>

            {/* Account Info Card */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-4">
                    <img
                        src={user.photoURL || 'https://via.placeholder.com/150'}
                        alt="profile"
                        className="w-16 h-16 rounded-full border border-slate-200 dark:border-slate-600 object-cover"
                    />
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                            {user.displayName}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user.email}</p>
                    </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-5 space-y-5">
                    {/* Display name — editable */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                            Display Name
                        </label>
                        {isEditingName ? (
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <input
                                    type="text"
                                    value={nameDraft}
                                    onChange={(e) => setNameDraft(e.target.value)}
                                    disabled={savingName}
                                    autoFocus
                                    maxLength={60}
                                    className="w-full sm:flex-1 text-sm font-medium text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 disabled:opacity-60"
                                />
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleSaveName}
                                        disabled={savingName}
                                        className="flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-bold text-white bg-[#6366F1] hover:bg-indigo-600 transition disabled:opacity-60 flex items-center justify-center gap-1.5"
                                    >
                                        {savingName && <Spinner size="sm" colorClass="text-white" />}
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancelEditName}
                                        disabled={savingName}
                                        className="flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition disabled:opacity-60"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                    {user.displayName}
                                </span>
                                <button
                                    onClick={() => setIsEditingName(true)}
                                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Email — read only */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                            Email
                        </label>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user.email}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                            Managed by Google Sign-In &mdash; can't be changed here.
                        </p>
                    </div>

                    {memberSince && (
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                                Member Since
                            </label>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{memberSince}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Appearance */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Theme Preference</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            Switch between light and dark mode.
                        </p>
                    </div>
                    <ThemeToggle />
                </div>
            </div>

            {/* Sign Out */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Sign Out</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            Sign out of your account on this device.
                        </p>
                    </div>
                    <button
                        onClick={() => logout().then(() => navigate('/'))}
                        className="shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white dark:bg-slate-800 border border-red-100 dark:border-red-900/50 rounded-2xl p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Delete Account</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            Permanently delete your account and all associated data.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-800/40 transition"
                    >
                        Delete Account
                    </button>
                </div>
            </div>

            <DeleteAccountModal
                open={showDeleteModal}
                deleting={deleting}
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}