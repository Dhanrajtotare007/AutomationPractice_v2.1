export interface NavItem {
  label: string;
  to: string;
  /** Optional short description used in the desktop dropdown. */
  description?: string;
  /** Nested links rendered as a dropdown menu. */
  children?: NavLink[];
}

export interface NavLink {
  label: string;
  to: string;
  description: string;
}

/** Primary navigation — kept intentionally short and task oriented. */
export const PRIMARY_NAV: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Practice Labs', to: '/labs' },
  { label: 'Challenges', to: '/challenges' },
  {
    label: 'Resources',
    to: '/resources',
    children: [
      { label: 'Resources hub', to: '/resources', description: 'Everything for learning automation testing' },
      { label: 'Automation guides', to: '/blog', description: 'Practical articles on locators, waits and CI' },
      { label: 'Interview questions', to: '/interview-preparation', description: 'SDET questions with model answers' },
      { label: 'API reference', to: '/api-docs', description: 'Exercises against a real REST API' },
    ],
  },
  { label: 'About', to: '/about' },
];

/** Footer resource column. */
export const FOOTER_RESOURCES: NavLink[] = [
  { label: 'Automation guides', to: '/blog', description: 'Practical, field-tested articles' },
  { label: 'Interview questions', to: '/interview-preparation', description: 'Prepare for SDET interviews' },
  { label: 'API reference', to: '/api-docs', description: 'Practice API testing' },
  { label: 'Testing challenges', to: '/challenges', description: 'Scenario based exercises' },
  { label: 'Search', to: '/search', description: 'Find labs, locators and guides' },
];

/** Footer support column. */
export const FOOTER_SUPPORT: NavLink[] = [
  { label: 'About Automation Practice', to: '/about', description: 'Why this platform exists' },
  { label: 'Contact & support', to: '/contact', description: 'Send feedback or report a bug' },
  { label: 'Practice Labs', to: '/labs', description: 'All 15 interactive labs' },
];

/** Convenience lookup used for breadcrumbs and active states. */
export const NAV_BY_PATH = [...PRIMARY_NAV, ...FOOTER_RESOURCES].reduce<Record<string, string>>((acc, item) => {
  acc[item.to] = item.label;
  return acc;
}, {});

/** Top-level paths used to highlight a section in the header. */
export const SECTION_PREFIXES: { prefix: string; to: string }[] = [
  { prefix: '/labs', to: '/labs' },
  { prefix: '/challenges', to: '/challenges' },
  { prefix: '/blog', to: '/blog' },
  { prefix: '/resources', to: '/resources' },
  { prefix: '/interview-preparation', to: '/interview-preparation' },
  { prefix: '/api-docs', to: '/api-docs' },
  { prefix: '/about', to: '/about' },
  { prefix: '/contact', to: '/contact' },
  { prefix: '/search', to: '/search' },
];
