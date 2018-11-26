import React from 'react';
import style from './index.module.css';
import Loader from '../Loader';
import { formatDuration } from '../../utils/time';

function SearchResults({ results, onSelect, isLoading }) {
  return (
    <>
      <ul className={style.results}>
        {results.map(({ name, artists, album, duration_ms, uri }) => {
          artists = artists.map(artist => artist.name);
          const images = album.images;
          const image = images[images.length - 1];
          const albumCover = image && image.url;

          return <li className={style.item}
                     onClick={() => onSelect({ name, artists, duration: duration_ms, uri })}
                     key={uri}>
            <img className={style['item-image']} src={albumCover} alt="Album Cover"/>
            <span className={style['item-name']}>{name}</span>
            <span className={style['item-artist']}>{artists.join(', ')}</span>
            <span className={style['item-duration']}>{formatDuration(duration_ms)}</span>
          </li>;
        })}
      </ul>
      {isLoading && <div className={style.loader}>
        <Loader/>
      </div>}
    </>
  )
}

export default SearchResults;
