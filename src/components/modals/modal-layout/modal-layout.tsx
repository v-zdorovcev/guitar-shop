import React from 'react';
import ReactDOM from 'react-dom';
import FocusTrap from 'focus-trap-react';

type ModalLayoutProps = {
  children: React.ReactNode;
  className?: string;
  onClose: () => void;
};

function ModalLayout({ children, className, onClose }: ModalLayoutProps) {
  React.useEffect(() => {
    document.body.classList.add('scroll-lock', 'scroll-lock-ios');
    document.body.addEventListener('keydown', handleCloseModalOnKeyDown);
    document.body.addEventListener('click', handleCloseModalOnClickOutside);

    return () => {
      document.body.classList.remove('scroll-lock', 'scroll-lock-ios');
      document.body.removeEventListener('keydown', handleCloseModalOnKeyDown);
      document.body.removeEventListener('click', handleCloseModalOnClickOutside);
    };
  }, []);

  const handleCloseModalOnKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleCloseModalOnClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const { closeModal } = target.dataset;

    if (closeModal) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <FocusTrap>
      <div className={`modal is-active ${className ? className : ''}`} data-testid="modal-layout">
        <div className="modal__wrapper">
          <div className="modal__overlay" data-close-modal data-testid="modal-overlay" />
          <div className="modal__content">
            {children}
            <button
              className="modal__close-btn button-cross"
              type="button"
              aria-label="Закрыть"
              onClick={onClose}
            >
              <span className="button-cross__icon" />
              <span className="modal__close-btn-interactive-area" />
            </button>
          </div>
        </div>
      </div>
    </FocusTrap>,
    document.body,
  );
}

export default ModalLayout;
