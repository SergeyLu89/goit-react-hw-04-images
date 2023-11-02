import React from 'react';
import Notiflix from 'notiflix';

import { fechImage } from 'api/api';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from 'components/Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';

export class App extends React.Component {
  state = {
    hits: [],
    query: '',
    page: 1,
    totalHits: null,
    isLoading: false,
    error: null,
    showModal: false,
    modalUrl: null,
  };

  async componentDidUpdate(_, prevState) {
    const { query, page } = this.state;

    if (
      this.state.page !== prevState.page ||
      this.state.query !== prevState.query
    ) {
      try {
        this.setState({ isLoading: true });
        const { hits, totalHits } = await fechImage(query, page);

        this.setState({
          hits: [...this.state.hits, ...hits],
          totalHits: totalHits,
        });
      } catch (error) {
        this.setState({ error: error.message });
      } finally {
        this.setState({ isLoading: false });
      }
    }
  }
  // -----------------------------Load Btn ---
  onLoadMoreBtn = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };
  // -----------------------------Load Btn ---
  // -----------------------------Form Submit ---
  onSearchbarSubmit = query => {
    this.setState({ query, page: 1, hits: [] });
  };
  // -----------------------------Form Submit ---
  // ---------------------------- modal ---
  openModal = url => {
    this.setState({ showModal: true, modalUrl: url });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };
  // ---------------------------- modal ---
  render() {
    const { hits, totalHits, isLoading, error, showModal, modalUrl } =
      this.state;
    return (
      <div>
        <Searchbar onSearchbarSubmit={this.onSearchbarSubmit} />

        {hits.length !== 0 && (
          <ImageGallery hits={hits} openModal={this.openModal} />
        )}
        {hits.length > 0 && hits.length < totalHits && (
          <Button onLoadMoreBtn={this.onLoadMoreBtn} />
        )}
        {isLoading && <Loader />}
        {error !== null && Notiflix.Notify.failure(`${error}`)}
        {showModal && (
          <Modal modalUrl={modalUrl} closeModal={this.closeModal} />
        )}
      </div>
    );
  }
}
