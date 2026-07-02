import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { deleteAllUserData } from '../lib/deleteUserData';
import DeleteAccountModal from '../components/DeleteAccountModal';
import Spinner from '../components/Spinner';
import {
    showSuccessToast,
    showErrorToast,
    showLoadingToast,
    dismissToast,
} from '../lib/toast';

export default function Profile() {
    const { user, updateDisplayName, reauthenticateWithGoogle, deleteAccount, logout } =
        useAuth();
    const navigate = useNavigate();

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
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Profile
                </h1>
                <p className="text-xs text-slate-400 font-medium mt-1">
                    Manage your account details.
                </p>
            </div>

            {/* Account Info Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-4">
                    <img
                        src={user.photoURL || 'https://via.placeholder.com/150'}
                        alt="profile"
                        className="w-16 h-16 rounded-full border border-slate-200 object-cover"
                    />
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                            {user.displayName}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-5 space-y-5">
                    {/* Display name — editable */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                            Display Name
                        </label>
                        {isEditingName ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={nameDraft}
                                    onChange={(e) => setNameDraft(e.target.value)}
                                    disabled={savingName}
                                    autoFocus
                                    maxLength={60}
                                    className="flex-1 text-sm font-medium text-slate-900 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 disabled:opacity-60"
                                />
                                <button
                                    onClick={handleSaveName}
                                    disabled={savingName}
                                    className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-[#6366F1] hover:bg-indigo-600 transition disabled:opacity-60 flex items-center gap-1.5"
                                >
                                    {savingName && <Spinner size="sm" colorClass="text-white" />}
                                    Save
                                </button>
                                <button
                                    onClick={handleCancelEditName}
                                    disabled={savingName}
                                    className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition disabled:opacity-60"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-800">
                                    {user.displayName}
                                </span>
                                <button
                                    onClick={() => setIsEditingName(true)}
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Email — read only */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                            Email
                        </label>
                        <p className="text-sm font-semibold text-slate-800">{user.email}</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                            Managed by Google Sign-In &mdash; can't be changed here.
                        </p>
                    </div>

                    {memberSince && (
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                Member Since
                            </label>
                            <p className="text-sm font-semibold text-slate-800">{memberSince}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sign Out */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-slate-800">Sign Out</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Sign out of your account on this device.
                        </p>
                    </div>
                    <button
                        onClick={() => logout().then(() => navigate('/'))}
                        className="shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-slate-800">Delete Account</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Permanently delete your account and all associated data.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 transition"
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