// Centralised legal content — shared by Login and Footer modals.
// Update here and both surfaces reflect the change automatically.

const sectionTitle = (text: string) => (
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-100 mt-5 first:mt-0">
        {text}
    </p>
);

const para = (text: string) => (
    <p>{text}</p>
);

const list = (items: string[]) => (
    <ul className="space-y-1 pl-3">
        {items.map((item) => (
            <li key={item} className="flex gap-2">
                <span className="text-indigo-400 shrink-0">·</span>
                <span>{item}</span>
            </li>
        ))}
    </ul>
);

export const privacyPolicyBody = (
    <div className="space-y-2">
        {sectionTitle('Overview')}
        {para('PrepIQ is a serverless, single-user interview preparation tool. All data you generate is stored exclusively under your own Firebase account and is never sold, rented, or shared with third parties for marketing purposes.')}

        {sectionTitle('What We Collect')}
        {para('When you sign in and use PrepIQ, the following data is stored in Firestore under your unique user ID:')}

        {sectionTitle('1 · Google Account Info')}
        {list([
            'Email address (used to identify your account)',
            'Display name (shown in the sidebar; editable from your profile)',
            'Profile photo URL (sourced from your Google account)',
            'Google UID (internal key — never exposed in the UI)',
        ])}

        {sectionTitle('2 · Job Applications')}
        {list([
            'Company name and job role title you enter',
            'The raw job description text you paste (stored to power AI analysis)',
            'Extracted skills with priority level and category (Core / Nice-to-Have / Red Flag)',
            'Focus areas and red flags identified from the JD',
            'Estimated role difficulty and company type inferred by Gemini',
        ])}

        {sectionTitle('3 · Question Bank')}
        {list([
            'AI-generated interview questions and their ideal reference answers',
            'Topic label and difficulty level per question',
            'Times a question has been answered',
            'Last AI-evaluated confidence score (1–5)',
            'Running average confidence score across all attempts',
            'SM-2 spaced-repetition fields: easiness factor, repetitions, review interval, next review date',
        ])}

        {sectionTitle('4 · Quiz Sessions')}
        {list([
            'Session timestamp',
            'Number of questions answered per session',
            'Average AI score for the session',
            'Job application name the session was taken for',
        ])}

        {sectionTitle('5 · Topic & Overall Progress')}
        {list([
            'Cumulative score sum and answer count per topic (used for the Weak Spots radar)',
            'Aggregated overall progress score per job application',
        ])}

        {sectionTitle('6 · Device-Level Storage')}
        {list([
            'prepiq_visited (localStorage) — a single boolean flag that remembers whether you have signed in before on this device. Not linked to your identity. Cleared only when your account is deleted.',
        ])}

        {sectionTitle('What We Do Not Collect')}
        {list([
            'The actual text you type as quiz answers — only the AI-evaluated score is saved, never the answer itself',
            'Payment or billing information (PrepIQ is free)',
            'Device identifiers, IP addresses, or location data',
            'Browsing history or cross-site tracking data',
        ])}

        {sectionTitle('Third-Party Services')}
        {list([
            'Firebase (Google) — authentication and Firestore database hosting. Your data is stored under Google\'s infrastructure and governed by Google\'s Privacy Policy.',
            'Google Gemini API — job descriptions, question contexts, and answer evaluation prompts are sent to Gemini for processing. No raw personal data (name, email) is included in these requests.',
            'Cloudflare Workers — acts as a secure API proxy between your browser and the Gemini API. Requests are routed but not stored by Cloudflare.',
        ])}

        {sectionTitle('Data Retention & Deletion')}
        {para('All your data is retained until you delete it. You can permanently delete your account — and every document associated with it — from your Profile page. This action is irreversible and removes all Firestore data, quiz history, job applications, and question banks tied to your account.')}

        {sectionTitle('Contact')}
        {para('For any privacy-related questions, open an issue on the GitHub repository or contact the developer directly.')}

        <p className="text-[10px] text-slate-300 dark:text-slate-600 pt-2">Last updated: July 13, 2026</p>
    </div>
);

export const termsOfServiceBody = (
    <div className="space-y-2">
        {sectionTitle('Acceptance')}
        {para('By signing in with Google and using PrepIQ, you agree to these terms. If you do not agree, do not use the service.')}

        {sectionTitle('Use of Service')}
        {list([
            'PrepIQ is provided for personal, non-commercial interview preparation use only.',
            'You are responsible for the job descriptions and content you upload.',
            'Do not attempt to circumvent rate limits, abuse the AI evaluation system, or interfere with other users\' data.',
        ])}

        {sectionTitle('AI-Generated Content')}
        {para('Questions, study plans, and answer evaluations are generated by Gemini AI. They are intended as preparation aids only — accuracy is not guaranteed. Do not treat AI output as professional career advice.')}

        {sectionTitle('Data & Privacy')}
        {para('Your data is stored in Firebase Firestore under your isolated user identity. See our Privacy Policy for full details on what is collected and how it is used.')}

        {sectionTitle('Availability')}
        {para('PrepIQ is provided as-is with no uptime guarantees. The service may be modified or discontinued at any time without notice.')}

        {sectionTitle('Limitation of Liability')}
        {para('PrepIQ and its developer are not liable for any outcomes related to interview preparation, career decisions, or AI-generated content consumed through this platform.')}

        <p className="text-[10px] text-slate-300 dark:text-slate-600 pt-2">Last updated: July 13, 2026</p>
    </div>
);
