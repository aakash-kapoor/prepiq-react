const techTags = ['React', 'TypeScript', 'Vite', 'Firebase', 'Gemini AI', 'Tailwind CSS'];

export default function AboutDeveloper() {
    return (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 border-t border-gray-100 dark:border-slate-800 pt-14 sm:pt-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 items-start">
                <div className="space-y-2">
                    <span className="text-[10px] font-bold tracking-widest text-[#6366F1] dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100/50 dark:border-indigo-800/50 px-2.5 py-0.5 rounded-md inline-block">
                        Behind the code
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-950 dark:text-slate-50 tracking-tight">About the developer</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Engineering intent, architecture, and optimizations.</p>
                </div>

                <div className="md:col-span-2 space-y-4 text-xs sm:text-[13px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                    <p>
                        Hi, I'm <span className="text-slate-900 dark:text-slate-100 font-semibold">Aakash Kapoor</span>. I engineered PrepIQ to bridge the gap between generic interview preparation frameworks and specific, production-targeted role demands.
                    </p>
                    <p>
                        Built on a lightweight stack featuring <span className="text-indigo-600 dark:text-indigo-400 font-semibold">React, TypeScript, and Vite</span>, the application runs entirely serverless over an isolated Cloud Firestore infrastructure with no backend to maintain.
                    </p>
                    <p>
                        By treating large language models as strict JSON schema engines rather than conversational nodes, PrepIQ extracts precise, predictable tech stacks from raw JD text — tracking confidence loops using responsive, dependency-free inline vector graphics.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                        {techTags.map((tag) => (
                            <span key={tag} className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 px-2.5 py-1 rounded-lg">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
