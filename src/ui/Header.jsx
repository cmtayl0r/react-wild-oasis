import styled from "styled-components";

// COMPONENT STYLES
const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
`;

function Header() {
  return (
    <StyledHeader>
      <h3>HEADER!</h3>
    </StyledHeader>
  );
}

export default Header;
