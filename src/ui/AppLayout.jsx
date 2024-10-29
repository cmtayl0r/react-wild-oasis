import { Outlet } from "react-router-dom";

// COMPONENTS
import Header from "./Header";
import Sidebar from "./Sidebar";
import styled from "styled-components";

// COMPONENT STYLES
const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
`;

const Main = styled.main`
  padding: 4rem 4.8rem 6.4rem;
  background-color: var(--color-grey-50);
`;

function AppLayout() {
  return (
    <StyledAppLayout>
      <Header />
      <Sidebar />
      <Main>
        <Outlet /> {/* // This is where the child routes will be rendered */}
      </Main>
    </StyledAppLayout>
  );
}

export default AppLayout;
