import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (text: string) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [inputText, setInputText] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside as any); //For mobile
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside as any);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleCreate = () => {
    onCreate(inputText);
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal" ref={modalRef}>
        <div className="modal-header">
          <span className="modal-close" onClick={onClose}>
            &times;
          </span>
        </div>
        <div className="modal-body">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text..."
          />
        </div>
        <div className="modal-footer">
          <button onClick={handleCreate}>Create</button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
