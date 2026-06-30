interface AppSelectorProps {
    applications: any[];
    selectedApp: any;
    onSelect: (app: any) => void;
}

export default function AppSelector({ applications, selectedApp, onSelect }: AppSelectorProps) {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap gap-2 items-center shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2">Analytics Target:</span>
            {applications.map((app) => (
                <button
                    key={app.id}
                    onClick={() => onSelect(app)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition max-w-[180px] truncate ${
                        selectedApp?.id === app.id
                            ? 'bg-[#6366F1] text-white border-[#6366F1]'
                            : 'bg-white text-slate-600 hover:bg-gray-50 border-gray-200'
                    }`}
                    title={`${app.company} — ${app.role}`}
                >
                    {app.company} — {app.role}
                </button>
            ))}
        </div>
    );
}
