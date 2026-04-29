import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ClientProviders } from '@/components/ClientProviders';
import { FontLoader } from '@/components/FontLoader';
import { renderAvailabilityPage } from '@/components/AvailabilityPage';
import { loadBeautySalonServiceDetail } from '@/cms/loaders/loadBeautySalonServiceDetail';
import { getCssVariablesFromTokens, getFontFamilyFromTokens } from '@/presentation/appearance/applyTokens';
import { resolveThemeAppearance, resolveThemeDefinition } from '@/presentation/themes/registry';
import { ServiceDetailPage } from '@/presentation/themes/shared/ServiceDetailPage';
import { buildServiceMetadata } from '@/lib/seo';

type ServiceRouteProps = {
  params: Promise<{ domain: string; slug: string }>;
};

export async function generateMetadata({ params }: ServiceRouteProps): Promise<Metadata> {
  const { domain, slug } = await params;
  const data = await loadBeautySalonServiceDetail(domain, slug);

  if (!data) {
    return {
      title: 'Not Found',
    };
  }

  if (data.kind === 'blocked') {
    return {
      title: `Site unavailable | ${domain}`,
    };
  }

  return buildServiceMetadata(data.serviceItem, data.settings, domain);
}

export default async function ServiceDetailRoute({ params }: ServiceRouteProps) {
  const { domain, slug } = await params;
  const data = await loadBeautySalonServiceDetail(domain, slug);

  if (!data) {
    notFound();
  }

  if (data.kind === 'blocked') {
    return renderAvailabilityPage({ availability: data.availability, domain });
  }

  const cssVars = getCssVariablesFromTokens(data.appearance.tokens);
  const fontFamily = getFontFamilyFromTokens(data.appearance.tokens);
  const resolvedTheme = resolveThemeDefinition(data.appearance.themeKey);
  const themeAppearance = resolveThemeAppearance(data.appearance, resolvedTheme);
  const Navbar = resolvedTheme.shell.Navbar;
  const Footer = resolvedTheme.shell.Footer;

  return (
    <ClientProviders defaultLocale={data.defaultLocale} availableLocales={data.availableLocales.map(l => l.code)}>
      <div
        data-button-style={themeAppearance.tokens.buttonStyle || 'pill'}
        style={cssVars}
        className={`flex min-h-screen w-full flex-col transition-colors duration-300 theme-${resolvedTheme.key}`}
      >
        <FontLoader fontFamily={fontFamily} />
        <Navbar
          appearance={themeAppearance}
          settings={data.settings}
          layoutConfig={themeAppearance.layout.blocks}
          domain={domain}
          navigation={resolvedTheme.navigation}
        />
        <main className="flex-grow">
          <ServiceDetailPage
            domain={domain}
            settings={data.settings}
            appearance={themeAppearance}
            serviceItem={data.serviceItem}
          />
        </main>
        <Footer appearance={themeAppearance} settings={data.settings} />
      </div>
    </ClientProviders>
  );
}
