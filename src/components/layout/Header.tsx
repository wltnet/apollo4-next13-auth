'use client'
import { useState, useContext, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useMutation, useApolloClient } from '@apollo/client';
import { useCookies } from 'react-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon as faMoonSolid, faA } from '@fortawesome/free-solid-svg-icons';
import { faMoon as faMoonRegular } from '@fortawesome/free-regular-svg-icons';
import { AuthContext } from '@/context/AuthProvider';
import { ThemePreferenceContext } from '@/context/Theme';
import { useIsFirstRender } from '@/hooks/isFirstRender';
import { LOGOUT_USER } from '@/gql';
import { 
  StyledHeader,
  SkipLink,
  Title,
  Wrapper,
  ButtonWrapper,
  Button,
} from './headerStyled';

interface ThemePreference {
  themePreference: string;
}

interface LinkInfo {
  link: string;
  text: string
}
interface LinkList {
  [key: string]: LinkInfo;
}

const links: LinkList = {
  '/register': { link: '/', text: 'Login' },
  '/': { link: '/register', text: 'Register' },
};
 
const Header = ({ themePreference }: ThemePreference) => {
  const pathname = usePathname();
  const themePreferenceContext = useContext(ThemePreferenceContext);
  const authContext = useContext(AuthContext);
  const userId = authContext.authInfo.userData?.id;
  const [darkMode, setDarkMode] = useState<boolean>(themePreference === 'dark');
  const [fontSize, setFontSize] = useState<string>('default');
  const isFirstRender = useIsFirstRender();
  const [, setCookie] = useCookies();
  const router = useRouter();
  const client = useApolloClient();
  const headerLink: LinkInfo = links[pathname];
  const headerRef = useRef<HTMLInputElement>(null);

  const [logoutUser, { data, loading, error }] = useMutation(LOGOUT_USER, {
    onCompleted(data) {
      if(data.logout.status === 'ok') {
        sessionStorage.removeItem('accessToken');
        authContext.setAuthInfo({
          accessToken: null,
          userData: null,
        });
        client.clearStore();
        router.push('/');
      }
    },
    variables: { userId },
  });

  useEffect(()=> {
    if(headerRef.current) headerRef.current.focus();
  },[pathname]);

  useEffect(() => {
    if (!isFirstRender) {
      const theme = darkMode ? 'dark' : 'light';
      document.body.setAttribute("data-theme", `${theme}-theme`);
      themePreferenceContext.setCurrentTheme(theme);
      setCookie('themePreference', theme, {
        path: '/',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) // 1 year
      });
    }
  }, [darkMode, isFirstRender]);

  useEffect(() => {
    document.body.setAttribute("data-font-size", fontSize);
  }, [fontSize]);
  
  const handleClick = () => {
    setDarkMode((prev) => !prev);
  };

  const handleChangeFontSize = (size: string) => () => {
    setFontSize(size);
  };

  const handleLogout = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    logoutUser();
  };

  const handleSkipLink = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = event.currentTarget.getAttribute('href') || '';
    (document.querySelector(target) as HTMLElement)?.focus();
  }

  return (
    <StyledHeader ref={headerRef} tabIndex={-1}>
      <SkipLink href="#main" onClick={handleSkipLink}>Skip to main</SkipLink>
      <Title>Next JS 13 Auth with Apollo</Title>
      <Wrapper>
        <nav>
          <ul>
            { userId && (
              <>
                <li><Link href="/admin">Admin</Link></li>
                <li><Link href="/member">Member</Link></li>
              </>
            )}
            { headerLink ? <li><Link href={headerLink.link}>{ headerLink.text }</Link></li> :
              <li><a href="#" onClick={handleLogout}>Logout</a></li>
            }
          </ul>
        </nav>
        <ButtonWrapper>
          <Button onClick={handleClick} title="Toggle between light and dark theme">
            <FontAwesomeIcon icon={ darkMode ? faMoonRegular : faMoonSolid } />
          </Button>
          <Button onClick={handleChangeFontSize('default')} title="Default size">
            <FontAwesomeIcon icon={faA} size="xs" />
          </Button>
          <Button onClick={handleChangeFontSize('medium')} title="Medium size">
            <FontAwesomeIcon icon={faA} size="sm" />
          </Button>
          <Button onClick={handleChangeFontSize('large')} title="Large size">
            <FontAwesomeIcon icon={faA} size="lg" />
          </Button>
        </ButtonWrapper>
      </Wrapper>
    </StyledHeader>
  );
};

export default Header;
