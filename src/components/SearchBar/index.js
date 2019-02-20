import React, { useEffect, useState } from 'react';
import style from './index.module.css';
import { SearchIcon } from '../../icons';
import { useDebounce } from '../../hooks';

function SearchBar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => onSearch(debouncedSearchQuery), [debouncedSearchQuery]);

  return (
    <div className={style.SearchBar}>
      <SearchIcon className={style['icon-search']}/>
      <input className={style.input} placeholder="Search for music..." autoFocus={true} spellCheck={false}
             onChange={e => setSearchQuery(e.target.value)}/>
    </div>
  );
}

export default SearchBar;
