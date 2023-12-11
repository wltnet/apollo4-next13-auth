import styled from 'styled-components';

export const StyledHeader = styled.header`
  min-height: 2.5em;
  padding: 0.9375em 1.25em;
  display: flex;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.headerBackgroundColour};
  color: ${({ theme }) => theme.colors.headerFont};

  & a:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.linkHover};
  }

  &:focus {
    outline: none;
  }
`;

export const SkipLink = styled.a`
  color: #fff;
  left: -100%;
  position: absolute;

  &:focus {
    left: 0;
    top: 0;
  }
`;

export const Title = styled.div`
  font-size: var(--font-size-p4);
  font-weight: 500;
  align-self: center;
`;

export const Wrapper = styled.div`
  align-self: center;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  width: 12rem;

  nav {
    display: flex;
    justify-content: flex-end;
    padding-bottom: 0.5rem;
  }

  ul {
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      display: inline;
      padding-left: 0.5rem;
    }
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const Button = styled.button`
  padding: 0.25rem 0.5rem;
  cursor: pointer;
`;
