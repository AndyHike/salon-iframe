import { AppearanceContract } from '../../cms/types';

export function getCssVariablesFromTokens(tokens: AppearanceContract['tokens']): React.CSSProperties {
  const buttonRadius = tokens.buttonStyle === 'pill' ? '9999px' : tokens.buttonStyle === 'square' ? '0px' : '8px';

  return {
    '--primary-color': tokens.primaryColor,
    '--font-site': tokens.fontFamily,
    '--btn-radius': buttonRadius,
    '--hero-overlay': tokens.heroOverlay?.toString() || '0.4',
  } as React.CSSProperties;
}

export function getFontFamilyFromTokens(tokens: AppearanceContract['tokens']): string {
  // Whitelist mapping can be added here
  return tokens.fontFamily || "'Inter', sans-serif";
}
