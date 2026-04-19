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

          // Sentinel: Secure URL handling to prevent MITM. Auto-upgrade http to https
          let secureHref = href;
          if (typeof secureHref === 'string' && secureHref.startsWith('http://')) {
            secureHref = secureHref.replace(/^http:\/\//i, 'https://');
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
