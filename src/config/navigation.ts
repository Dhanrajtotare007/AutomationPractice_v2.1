export interface NavItem {
  label: string;
  to: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Courses', to: '/courses' },
  { label: 'Events', to: '/events' },
  { label: 'Shop', to: '/shop' },
  { label: 'API', to: '/api-docs' },
  { label: 'Testing', to: '/testing' },
  { label: 'Blog', to: '/blog' },
  { label: 'Interview Preparation', to: '/interview-preparation' },
  { label: 'Contact', to: '/contact' },
];

/** Items shown in the condensed (tablet) navigation bar. */
export const COMPACT_NAV = PRIMARY_NAV.filter((item) => item.label !== 'Interview Preparation');
