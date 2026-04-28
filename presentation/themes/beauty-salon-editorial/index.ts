import { DefaultFooter } from '../shared/DefaultFooter';
import { DefaultNavbar } from '../shared/DefaultNavbar';
import type { BeautySalonThemeDefinition } from '../types';
import { beautySalonEditorialThemeManifest } from './manifest';
import { beautySalonEditorialTheme } from './theme';

export const beautySalonEditorialThemeDefinition = {
  ...beautySalonEditorialThemeManifest,
  sections: beautySalonEditorialTheme,
  shell: {
    Navbar: DefaultNavbar,
    Footer: DefaultFooter,
  },
} satisfies BeautySalonThemeDefinition;
