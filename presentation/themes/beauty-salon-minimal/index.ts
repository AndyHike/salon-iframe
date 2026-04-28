import { DefaultFooter } from '../shared/DefaultFooter';
import { DefaultNavbar } from '../shared/DefaultNavbar';
import type { BeautySalonThemeDefinition } from '../types';
import { beautySalonMinimalThemeManifest } from './manifest';
import { beautySalonMinimalTheme } from './theme';

export const beautySalonMinimalThemeDefinition = {
  ...beautySalonMinimalThemeManifest,
  sections: beautySalonMinimalTheme,
  shell: {
    Navbar: DefaultNavbar,
    Footer: DefaultFooter,
  },
} satisfies BeautySalonThemeDefinition;
