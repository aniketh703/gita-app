import { Href, Link } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { type ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (process.env.EXPO_OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();

          // 🛡️ Security: Enforce HTTPS for external links
          let secureHref = href;
          if (secureHref.startsWith('http://')) {
            console.warn('Insecure HTTP link detected, upgrading to HTTPS');
            secureHref = secureHref.replace('http://', 'https://');
          } else if (!secureHref.startsWith('https://')) {
            console.warn('External link does not use HTTPS protocol, proceeding with caution');
          }

          // Open the link in an in-app browser.
          await openBrowserAsync(secureHref, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    />
  );
}
