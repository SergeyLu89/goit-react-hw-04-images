import { useState, useEffect } from 'react';
import Notiflix from 'notiflix';

import { fechImage } from 'api/api';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from 'components/Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';

export const App = () => {
  const [hitsImg, setHitsImg] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalHitsImg, setTotalHitsImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalUrl, setModalUrl] = useState(null);

  useEffect(() => {
    if (!query) return;
    const fechData = async () => {
      try {
        setIsLoading(true);
        const { hits, totalHits } = await fechImage(query, page);

        setHitsImg(someHits => [...someHits, ...hits]);
        setTotalHitsImg(totalHits);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fechData();
  }, [page, query]);

  // -----------------------------Load Btn ---
  const onLoadMoreBtn = () => {
    setPage(page + 1);
  };
  // -----------------------------Load Btn ---
  // -----------------------------Form Submit ---
  const onSearchbarSubmit = query => {
    setQuery(query);
    setPage(1);
    setHitsImg([]);
  };
  // -----------------------------Form Submit ---
  // ---------------------------- modal ---
  const openModal = url => {
    setShowModal(true);
    setModalUrl(url);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  // ---------------------------- modal ---

  return (
    <div>
      <Searchbar onSearchbarSubmit={onSearchbarSubmit} />

      {hitsImg.length !== 0 && (
        <ImageGallery hits={hitsImg} openModal={openModal} />
      )}
      {hitsImg.length > 0 && hitsImg.length < totalHitsImg && (
        <Button onLoadMoreBtn={onLoadMoreBtn} />
      )}
      {isLoading && <Loader />}
      {error !== null && Notiflix.Notify.failure(`${error}`)}
      {showModal && <Modal modalUrl={modalUrl} closeModal={closeModal} />}
    </div>
  );
};
