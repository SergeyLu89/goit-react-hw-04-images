import { useEffect } from 'react';
import css from './Modal.module.css';

export const Modal = ({ closeModal, modalUrl }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const onKeyboardPress = evt => {
      if (evt.code === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', onKeyboardPress);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', onKeyboardPress);
    };
  }, [closeModal]);

  const onOverlayClick = evt => {
    if (evt.currentTarget === evt.target) {
      closeModal();
    }
  };

  return (
    <div className={css.backdrop} onClick={onOverlayClick}>
      <div className={css.modal}>
        <button
          type="button"
          className={css.modalCloseBtn}
          onClick={closeModal}
        >
          ✖
        </button>
        <img src={modalUrl} alt="Large img" />
      </div>
    </div>
  );
};
