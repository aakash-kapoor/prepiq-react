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
  | 'chore';

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  tags: readonly ChangelogTag[];
}

export const changelog: readonly ChangelogEntry[] = [
  {
    version: 'v0.9.0',
    date: 'Jul 3, 2026',
    title: 'Track Selector Dropdown, Skeletons & Global Motion Overhaul',
    description:
      'Replaced the horizontal track selector button row with a custom, premium animatable dropdown (TrackSelector). Modularized the shimmer skeleton loaders by separating inner content bones from layout headers. Added smooth, flicker-free skeleton transition states (with a 400ms minimum loading delay on switch) by introducing a selection-tracking pattern (prevSelectedAppIdRef) that prevents double-load stutters on initial render. Added skeleton loader states to Profile (600ms minimum loading delay on visit) and JD Analyzer results column. Additionally, migrated animations to the new motion/react (v12) package, configured a unified spring configuration in src/main.tsx, and enabled automatic OS-level accessibility compliance via reducedMotion="user" in the layout.',
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
      'Added error boundaries so a crash on one page no longer breaks the whole app, replaced loading text with spinners and progress bars, introduced toast notifications for a smoother feedback experience, and fixed the difficulty badge on the JD Analyzer to correctly show Junior, Mid-Level, or Senior.',
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