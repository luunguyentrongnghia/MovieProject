import * as PropTypes from 'prop-types';
import IconPlay from '../assets/play-button.png';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import  Modal from "react-modal";
import { useState } from 'react';
import YouTube from 'react-youtube';

Modal.setAppElement('#root');



const opts = {
  height: '390',
  width: '640',
  playerVars: {
    autoplay: 1 as 1,
  },
};

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1200 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1200, min: 600 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 1
  }
};

type Movie = {
  id: number;
  poster_path: string;
  title: string;
}

type Props = {
  title: string;
  data: Movie[];
}

const MovieList = ({ title, data }: Props) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState('');

  const handleTrailer = async (id: number) => {
    setTrailerKey('');
    try {
      const url = `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
        }
      };
      const movieKey = await fetch(url, options);
      const data = await movieKey.json();
      if (data.results && data.results.length > 0) {
        setTrailerKey(data.results[0].key);
        setIsOpen(true);
      } else {
        console.log('No trailers found');
      }
    } catch (error) {
      setIsOpen(false);
      console.error(error);
    }
  };

  return (
    <div className="text-white p-10 mb-10">
      <h2 className="uppercase text-xl font-bold mb-4">{title}</h2>
      <Carousel responsive={responsive} className="flex items-center space-x-4" itemClass="carousel-item-width">
        {data && data.length > 0 && data.map((item, index) => (
          <div key={index} className="w-[200px] h-[300px] relative group" onClick={() => handleTrailer(item.id)}>
            <div className="group-hover:scale-105 transition-transform duration-500 ease-in-out w-full h-full cursor-pointer">
              <div className="absolute top-0 left-0 w-full h-full bg-black/40" />
              <img src={`${import.meta.env.VITE_IMG_URL}${item.poster_path}`} alt="" className="w-full h-full object-cover" />
              <div className="absolute bottom-4 left-0">
                <p className="uppercase text-md">{item.title}</p>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        style={
          {
  overlay:{
    position:"fixed",
    zIndex:9999
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
}
        }
        contentLabel="Example Modal"
      >
        {trailerKey ? <YouTube videoId={trailerKey} opts={opts} /> : <p>Loading...</p>}
      </Modal>
    </div>
  );
}

MovieList.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array
}

export default MovieList;
