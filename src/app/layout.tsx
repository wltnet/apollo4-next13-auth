import './globals.css'
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { ApolloWrapper } from "../wrapper/ApolloWrapper";
import StyledComponentsRegistry from './lib/registry';
import { AuthProvider } from '@/context/AuthProvider';
import Theme from '@/context/Theme';
import AuthWrapper from '@/wrapper/AuthWrapper';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GlobalStyles from './GlobalStyles';
import styles from './page.module.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next JS 13 with Apollo 4, express and mongoDB login',
  description: 'Next JS 13 with Apollo 4, express and mongoDB login',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies();
  const theme = cookieStore?.get('themePreference')?.value || 'light';
  return (
    <html lang="en">
      <body className={inter.className} data-theme={`${theme}-theme`} data-font-size="default">
        <AuthProvider>
          <ApolloWrapper>
            <AuthWrapper>
              <StyledComponentsRegistry>
                <Theme themePreference={theme}>
                  <GlobalStyles />
                  <Header themePreference={theme} />
                  <main id="main" className={styles.main} tabIndex={-1}>
                  {children}
                  </main>
                  <Footer />
                </Theme>
              </StyledComponentsRegistry>
            </AuthWrapper>
          </ApolloWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}
