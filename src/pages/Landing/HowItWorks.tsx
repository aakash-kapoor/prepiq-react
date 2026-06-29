const steps = [
    {
        number: '01',
        title: 'Paste the job description',
        description: 'Drop in any software engineering JD — full-time, contract, or internship. PrepIQ handles the rest.',
    },
    {
        number: '02',
        title: 'Get your knowledge map',
        description: 'Gemini AI reverse-engineers the role into a ranked list of topics, separating must-haves from nice-to-haves.',
    },
    {
        number: '03',
        title: 'Drill your weak spots',
        description: 'Work through adaptive flashcard quizzes and rate your confidence on each topic from 1 to 5.',
    },
    {
        number: '04',
        title: 'Follow your study plan',
        description: 'A day-by-day sprint timeline is generated from your lowest-confidence areas — right up to interview day.',
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="bg-white border-y border-gray-100 py-16 sm:py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12 sm:mb-16">
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">The workflow</p>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">From job description to offer-ready in four steps.</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {steps.map((step) => (
                        <div key={step.number} className="relative space-y-3">
                            <div className="text-3xl font-black text-indigo-100 tracking-tighter leading-none">{step.number}</div>
                            <h3 className="text-sm font-bold text-slate-900 tracking-tight">{step.title}</h3>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
