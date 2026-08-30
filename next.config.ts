import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // `remotePatterns` is gone, and that is not a loosening.
  //
  // It only ever gated Next's built-in image optimizer, and admin-hosted media
  // no longer goes through it: those images arrive from the admin with a
  // finished `srcset` and render as plain `<img>` (see presentation/themes/
  // shared/CmsImage.tsx). Nothing here reaches `/_next/image` any more.
  //
  // Worth recording why keeping it would have been worse than useless: the list
  // allowed only `picsum.photos` and `*.r2.dev`, while the admin has moved to a
  // custom media domain. It was already refusing the real image host - so as
  // soon as the admin switched to transformed delivery, these images would have
  // broken rather than merely stayed oversized. That is the one place in this
  // whole migration where doing nothing was worse than doing nothing.
  output: 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
