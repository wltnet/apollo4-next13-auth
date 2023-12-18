import styled from 'styled-components';
import { device } from '@/util/device';

export const StyledHeader = styled.header`
  min-height: 2.5em;
  padding: 0.9375em 1.25em;
  display: flex;
  flex-direction: column;
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

  @media ${device.tablet} {
    flex-direction: row;
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
  align-self: flex-end;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  width: 12rem;
  margin-top: 0.25rem;

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

  @media ${device.tablet} {
    align-self: center;
    flex-direction: column;
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
