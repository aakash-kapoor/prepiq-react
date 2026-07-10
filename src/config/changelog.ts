export type ChangelogTag =
  | 'feat'
  | 'fix'
  | 'ui'
  | 'docs'
  | 'deploy'
  | 'responsive'
  | 'typescript'
  | 'seo'
  | 'launch'
  | 'refactor'
  | 'chore'
  | 'theme';

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  tags: readonly ChangelogTag[];
}

export const changelog: readonly ChangelogEntry[] = [
  {
    version: 'v0.19.0',
    date: 'Jul 10, 2026',
    title: 'Secure AI Requests & Rate Limit Handling',
    description:
      'Improved AI request security and added clear rate limit messages across job analysis, quizzes, and study plans.',
    tags: ['feat', 'fix', 'refactor'],
  },
  {
    version: 'v0.18.0',
    date: 'Jul 9, 2026',
    title: 'Direct Quiz Launching & Progress Protection',
    description:
      'Protected quiz progress from accidental navigation, added direct quiz launching from Weak Spots and Study Plans with the current track pre-selected, and improved code organization.',
    tags: ['feat', 'fix', 'refactor', 'ui'],
  },
  {
    version: 'v0.17.0',
    date: 'Jul 8, 2026',
    title: 'Cloudflare Proxy, PWA Support & Offline Improvements',
    description:
      'Secured AI requests with a Cloudflare proxy, added full PWA support, improved offline handling across the app, and introduced a new brand logo.',
    tags: ['feat', 'ui', 'deploy', 'docs'],
  },
  {
    version: 'v0.16.0',
    date: 'Jul 7, 2026',
    title: 'Custom Dropdowns, Collapsible Job Blueprints & Layout Enhancements',
    description:
      'Added custom dropdowns, a collapsible Job Blueprint section, a new Study Plan loading skeleton, a dedicated skeleton loader for the Questions container when generating questions, direct phrasing for generated ideal answers, and various layout improvements.',
    tags: ['feat', 'ui', 'refactor', 'docs'],
  },
  {
    version: 'v0.15.0',
    date: 'Jul 6, 2026',
    title: 'Native PDF Study Plan Export',
    description:
      'Study Plans can now be exported as high-quality PDFs with a clean layout, page numbers, and proper page breaks.',
    tags: ['feat', 'ui', 'refactor', 'responsive'],
  },
  {
    version: 'v0.14.0',
    date: 'Jul 6, 2026',
    title: 'Quiz Session Tracking & Dashboard Trends',
    description:
      'Quiz sessions are now saved to history, the Dashboard includes a new Confidence Trend chart, and a Questions page parsing issue was fixed.',
    tags: ['feat', 'fix', 'ui'],
  },
  {
    version: 'v0.13.0',
    date: 'Jul 5, 2026',
    title: 'Consistent Terminology',
    description: 'Renamed Weaknesses to Weak Spots, removed confusing jargon, and standardized all labels across the application.',
    tags: ['chore', 'ui'],
  },
  {
    version: 'v0.12.0',
    date: 'Jul 5, 2026',
    title: 'Delete Job Applications',
    description: 'Added the ability to delete individual job applications from the dashboard. This action safely wipes all nested questions and performance data from Firestore.',
    tags: ['feat', 'ui'],
  },
  {
    version: 'v0.11.0',
    date: 'Jul 5, 2026',
    title: 'Global Dark Mode Support',
    description: 'Implemented comprehensive dark mode across the entire application in a single deployment. Upgraded the AppLayout, liquid glass navigation, and core components with targeted Tailwind dark utility classes for a seamless, high-contrast low-light experience.',
    tags: ['feat', 'ui', 'theme'],
  },
  {
    version: 'v0.10.0',
    date: 'Jul 4, 2026',
    title: 'Collapsible Sidebar, Scroll Restoration & Profile Fixes',
    description:
      'Added a collapsible sidebar, automatic scroll restoration between pages, and fixed the Profile page Danger Zone rendering issue.',
    tags: ['feat', 'ui', 'fix', 'responsive'],
  },
  {
    version: 'v0.9.0',
    date: 'Jul 3, 2026',
    title: 'Track Selector, Smoother Loading & Motion Improvements',
    description:
      'Introduced a new animated track selector dropdown for a cleaner experience. Redesigned loading skeletons across the app with smoother transitions to reduce flickering when switching tracks. Added loading states to the Profile page and Analyze page results for better visual feedback. Also improved animations throughout the app with more consistent motion and automatic support for users who prefer reduced motion.',
    tags: ['feat', 'ui', 'fix', 'refactor'],
  },
  {
    version: 'v0.8.0',
    date: 'Jul 2, 2026',
    title: 'User Profile Page & Account Management',
    description:
      'Introduced a dedicated Profile page accessible from the sidebar, mobile header, and More menu. Users can now edit their display name in place, sign out directly from the profile page, and permanently delete their account. Account deletion safely wipes all Firestore data before removing the Firebase Auth record. Fixed a modal backdrop stacking-context bug by rendering the confirmation dialog through a React Portal.',
    tags: ['feat', 'ui', 'fix'],
  },
  {
    version: 'v0.7.0',
    date: 'Jul 1, 2026',
    title: 'UI Hardening, Modular Routing & Mobile Nav Overhaul',
    description:
      'Re-architected the Quiz module into distinct Launcher and Active Session views. Upgraded mobile navigation with a premium "liquid glass" bottom bar and a slide-up "More" drawer. Abstracted LegalModal, EmptyState, and SVG Icons into reusable components to significantly DRY up the codebase.',
    tags: ['feat', 'ui', 'responsive', 'chore'],
  },
  {
    version: 'v0.6.0',
    date: 'Jun 30, 2026',
    title: 'Error boundaries, loading states, and toast notifications',
    description:
      'Added error boundaries so a crash on one page no longer breaks the whole app, replaced loading text with spinners and progress bars, introduced toast notifications for a smoother feedback experience, and fixed the difficulty badge on the Analyze page to correctly show Junior, Mid-Level, or Senior.',
    tags: ['feat', 'fix', 'ui', 'responsive'],
  },
  {
    version: 'v0.5.0',
    date: 'Jun 29, 2026',
    title: 'Legal pages, project organization, and landing page refinements',
    description:
      'Improved the overall user experience by introducing reusable Terms of Service and Privacy Policy modal dialogs, reorganized project data with a dedicated changelog module, refined responsive layouts and component styling, and enhanced the landing page with better navigation and footer structure for a more polished SaaS experience.',
    tags: ['feat', 'ui', 'refactor', 'responsive']
  },
  {
    version: 'v0.4.0',
    date: 'Jun 28, 2026',
    title: 'Landing and login page redesign',
    description:
      'Overhauled the landing page with a sticky frosted navbar, how-it-works section, stats strip, 6-feature grid, and a full-width CTA banner. Login page now includes trust signal pills, SVG icons, and an improved dark right panel.',
    tags: ['feat', 'ui', 'responsive'],
  },
  {
    version: 'v0.3.2',
    date: 'Jun 27, 2026',
    title: 'Firebase Hosting target configured',
    description:
      'Configured Firebase Hosting for prep-iq.web.app, updated hosting targets in .firebaserc, and ignored the local Firebase cache directory.',
    tags: ['chore', 'deploy'],
  },
  {
    version: 'v0.3.1',
    date: 'Jun 27, 2026',
    title: 'SEO meta tags and smooth scrolling',
    description:
      'Added Open Graph, Twitter Card, and keyword metadata. Enabled smooth anchor scrolling and corrected misplaced meta tags outside the document head.',
    tags: ['fix', 'seo'],
  },
  {
    version: 'v0.3.0',
    date: 'Jun 26, 2026',
    title: 'TypeScript errors resolved',
    description:
      'Resolved unused declarations, fixed JSX namespace issues, and cleaned up TypeScript compiler warnings across the project.',
    tags: ['fix', 'typescript'],
  },
  {
    version: 'v0.2.0',
    date: 'Jun 25, 2026',
    title: 'README and project documentation',
    description:
      'Replaced the default Vite README with comprehensive project documentation, including setup instructions, environment variables, architecture overview, and folder structure.',
    tags: ['docs'],
  },
  {
    version: 'v0.1.0',
    date: 'Jun 24, 2026',
    title: 'Initial release',
    description:
      'Released the first working version of PrepIQ featuring AI-powered job description analysis, adaptive quizzes, weakness detection, and personalized study plans powered by Gemini AI and Firebase.',
    tags: ['feat', 'launch'],
  },
] as const;