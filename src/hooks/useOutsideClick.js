import { useEffect, useRef } from "react";

function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef();

  // Close the dialog when the user clicks outside of it
  useEffect(() => {
    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    }
    // Add event listener to handle clicks outside the dialog
    // true/listenCapturing is an argument to addEventListener that tells the event listener to listen during the capture phase
    // This is to avoid the event bubbling up to the document and closing the dialog immediately
    document.addEventListener("click", handleClick, listenCapturing);
    return () =>
      document.removeEventListener("click", handleClick, listenCapturing);
  }, [handler, listenCapturing]);

  return ref;
}

export default useOutsideClick;
