import { createContext, useState, useContext } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { EllipsisVertical } from "lucide-react";
import useOutsideClick from "../hooks/useOutsideClick";
// import { useOutsideClick } from "../hooks/useOutsideClick";

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

// -----------------------------------------------------------------------------
// 1 - Set Context for sharing state
// -----------------------------------------------------------------------------

const MenusContext = createContext();

// -----------------------------------------------------------------------------
// 2 - Create Parent Component to manage shared state and provide context
// -----------------------------------------------------------------------------
function Menus({ children }) {
  const [openId, setOpenId] = useState(""); // "" equals closed
  const [position, setPosition] = useState(null);

  const close = () => setOpenId("");
  const open = setOpenId;

  return (
    <MenusContext.Provider
      value={{ openId, close, open, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

// -----------------------------------------------------------------------------
// 3 - Create Child components
// -----------------------------------------------------------------------------

function Toggle({ id }) {
  const { openId, close, open, position, setPosition } =
    useContext(MenusContext);

  function handleClick(e) {
    // To deal with the position of the menu, we need to get the position of the button
    // DOM traversal to find the button element using the event target and closest method
    const rect = e.target.closest("button").getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });

    // If the menu is closed or another menu is open, open the menu
    // Otherwise, close the menu
    openId === "" || openId !== id ? open(id) : close();
  }

  return (
    <StyledToggle onClick={handleClick}>
      <EllipsisVertical />
    </StyledToggle>
  );
}

function List({ id, children }) {
  const { openId, position, close } = useContext(MenusContext);

  // Custom hook to handle clicks outside the menu
  // Use ref to get the reference to the list element and pass it to the useOutsideClick hook
  const ref = useOutsideClick(close);

  // If the menu is closed, return null
  if (openId !== id) return null;

  return createPortal(
    <StyledList ref={ref} position={position}>
      {children}
    </StyledList>,
    document.body
  );
}

function Button({ children, icon, onClick }) {
  const { close } = useContext(MenusContext);

  const handleClick = () => {
    onClick?.(); // Call the onClick function if it exists
    close(); // Close the menu
  };

  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

// -----------------------------------------------------------------------------
// 4 - Add Child component as properties to Parent component
// -----------------------------------------------------------------------------

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
