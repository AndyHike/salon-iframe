import type { AppearanceContract } from '../../cms/types';
import { beautySalonClassicThemeDefinition } from './beauty-salon-classic';
import { beautySalonEditorialThemeDefinition } from './beauty-salon-editorial';
import { beautySalonMinimalThemeDefinition } from './beauty-salon-minimal';
import type { BeautySalonThemeDefinition } from './types';

const DEFAULT_THEME_KEY = 'beauty-salon-classic';

export const themeDefinitions = {
  [beautySalonClassicThemeDefinition.key]: beautySalonClassicThemeDefinition,
  [beautySalonEditorialThemeDefinition.key]: beautySalonEditorialThemeDefinition,
  [beautySalonMinimalThemeDefinition.key]: beautySalonMinimalThemeDefinition,
} satisfies Record<string, BeautySalonThemeDefinition>;

export const themeRegistry: Record<string, BeautySalonThemeDefinition['sections']> = Object.fromEntries(
  Object.entries(themeDefinitions).map(([key, definition]) => [key, definition.sections])
) as Record<string, BeautySalonThemeDefinition['sections']>;

export function resolveThemeDefinition(themeKey: string | null | undefined): BeautySalonThemeDefinition {
  if (themeKey && Object.prototype.hasOwnProperty.call(themeDefinitions, themeKey)) {
    return themeDefinitions[themeKey as keyof typeof themeDefinitions];
  }

  return themeDefinitions[DEFAULT_THEME_KEY as keyof typeof themeDefinitions];
}

export function resolveThemeAppearance(
  appearance: AppearanceContract,
  themeDefinition = resolveThemeDefinition(appearance.themeKey),
): AppearanceContract {
  const supportedBlocks = new Set(themeDefinition.supportedBlocks);
  const rawBlocks = appearance.layout.blocks?.length
    ? appearance.layout.blocks
    : themeDefinition.supportedBlocks;
  const supportedRequestedBlocks = rawBlocks.filter((blockName) => supportedBlocks.has(blockName));
  const blocks = supportedRequestedBlocks.length
    ? supportedRequestedBlocks
    : themeDefinition.supportedBlocks;
  const sectionVariants = { ...appearance.sectionVariants };

  Object.entries(themeDefinition.fallbackSectionVariants).forEach(([sectionKey, fallbackVariant]) => {
    const supportedVariants = themeDefinition.supportedSectionVariants[sectionKey] || [];
    const requestedVariant = sectionVariants[sectionKey];

    if (!requestedVariant || !supportedVariants.includes(requestedVariant)) {
      sectionVariants[sectionKey] = fallbackVariant;
    }
  });

  return {
    ...appearance,
    templateKey: themeDefinition.templateKey,
    themeKey: themeDefinition.key,
    layout: {
      ...appearance.layout,
      blocks,
    },
    sectionVariants,
    themeData: appearance.themeData || {},
  };
}
