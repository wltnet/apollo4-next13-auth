const size = {
  mobileS: '20em',
  mobileM: '23.4375em',
  mobileL: '26.5625em',
  tablet: '48em',
  laptop: '64em',
  laptopL: '90em',
  desktop: '160em'
}

export const device = {
  mobileS: `(min-width: ${size.mobileS})`,
  mobileM: `(min-width: ${size.mobileM})`,
  mobileL: `(min-width: ${size.mobileL})`,
  tablet: `(min-width: ${size.tablet})`,
  laptop: `(min-width: ${size.laptop})`,
  laptopL: `(min-width: ${size.laptopL})`,
  desktop: `(min-width: ${size.desktop})`,
  desktopL: `(min-width: ${size.desktop})`
};
