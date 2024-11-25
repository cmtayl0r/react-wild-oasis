import { X } from "lucide-react";
import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import useOutsideClick from "../hooks/useOutsideClick";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  /* border-radius: var(--border-radius-sm); */
  border-radius: 100vw;
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 4.4rem;
    height: 4.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    strokModale: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;

// -----------------------------------------------------------------------------
// 1 - Set Context for sharing state
// -----------------------------------------------------------------------------

const ModalContext = createContext();

// -----------------------------------------------------------------------------
// 2 - Create Parent Component to manage shared state and provide context
// -----------------------------------------------------------------------------

function Modal({ children }) {
  const [openName, setOpenName] = useState(null);

  const close = () => setOpenName(null);
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ open, close, openName }}>
      {children}
    </ModalContext.Provider>
  );
}

// -----------------------------------------------------------------------------
// 3 - Create Child components
// -----------------------------------------------------------------------------

// opens prop in Open, is the name of the modal to open
// name prop in ModalOverlay, is the name of the modal to show
// This way we can have multiple modals in the same page and open them independently

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);
  // Clones children and adds onClick event to open the modal
  // Turns any child element into a trigger to open the modal
  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function ModalOverlay({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  // Custom hook to close modal when clicking outside
  // We use ref to get the reference to the modal element because we need to check if the click is outside of it
  const ref = useOutsideClick(close);
  // If the name of the modal is different from the openName, return null
  if (name !== openName) return null;

  // We use createPortal to render the modal outside the normal DOM tree
  // This is to avoid styling conflicts with the rest of the app
  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={close}>
          <X />
        </Button>
        {cloneElement(children, { onCloseModal: close })}
        {/* 
          // We clone the children and add the onCloseModal prop
          // We pass the onCloseModal function to the children
        */}
      </StyledModal>
    </Overlay>,
    document.body
  );
}

// -----------------------------------------------------------------------------
// 4 - Add Child component as properties to Parent component
// -----------------------------------------------------------------------------
Modal.Open = Open;
Modal.Overlay = ModalOverlay;

export default Modal;
