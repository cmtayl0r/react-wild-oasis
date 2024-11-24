import { X } from "lucide-react";
import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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

const ModalContext = createContext();

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

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);
  // explain the cloneElement
  // https://reactjs.org/docs/react-api.html#cloneelement

  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function ModalOverlay({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick(close);

  // const ref = useRef();

  // // Close the modal when the user presses the Escape key
  // useEffect(() => {
  //   const handleEscape = (event) => {
  //     if (event.key === "Escape") close();
  //   };
  //   window.addEventListener("keydown", handleEscape);
  //   return () => window.removeEventListener("keydown", handleEscape);
  // }, [close]);

  // // Close the modal when the user clicks outside of it
  // useEffect(() => {
  //   function handleClick(event) {
  //     if (ref.current && !ref.current.contains(event.target)) {
  //       close();
  //     }
  //   }
  //   // Add event listener to handle clicks outside the modal
  //   // true is an argument to addEventListener that tells the event listener to listen during the capture phase
  //   // This is to avoid the event bubbling up to the document and closing the modal immediately
  //   document.addEventListener("click", handleClick, true);
  //   return () => document.removeEventListener("click", handleClick, true);
  // }, [close]);

  if (name !== openName) return null;

  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={close}>
          <X />
        </Button>
        {cloneElement(children, { onCloseModal: close })}
      </StyledModal>
    </Overlay>,
    document.body
  );
}

Modal.Open = Open;
Modal.Overlay = ModalOverlay;

export default Modal;
