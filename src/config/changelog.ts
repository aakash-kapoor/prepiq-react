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