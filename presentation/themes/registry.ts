import { beautySalonClassicTheme } from './beauty-salon-classic/theme';
import { beautySalonEditorialTheme } from './beauty-salon-editorial/theme';

export const themeRegistry: Record<string, Record<string, React.ComponentType<any>>> = {
  'beauty-salon-classic': beautySalonClassicTheme,
  'beauty-salon-editorial': beautySalonEditorialTheme,
};
