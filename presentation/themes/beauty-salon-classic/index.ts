import { DefaultFooter } from '../shared/DefaultFooter';
import { DefaultNavbar } from '../shared/DefaultNavbar';
import type { BeautySalonThemeDefinition } from '../types';
import { beautySalonClassicThemeManifest } from './manifest';
import { beautySalonClassicTheme } from './theme';

export const beautySalonClassicThemeDefinition = {
  ...beautySalonClassicThemeManifest,
  sections: beautySalonClassicTheme,
  shell: {
    Navbar: DefaultNavbar,
    Footer: DefaultFooter,
  },
} satisfies BeautySalonThemeDefinition;
