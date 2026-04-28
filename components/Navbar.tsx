'use client';

import { DefaultNavbar } from '../presentation/themes/shared/DefaultNavbar';
import type { ThemeNavbarProps } from '../presentation/themes/types';

type NavbarProps = Omit<ThemeNavbarProps, 'navigation'> & {
  navigation?: ThemeNavbarProps['navigation'];
};

export function Navbar({ navigation, ...props }: NavbarProps) {
  return (
    <DefaultNavbar
      {...props}
      navigation={navigation || { transparency: 'transparent-over-hero-image' }}
    />
  );
}
