import React from 'react';
import style from './index.module.css';

function Loader() {
  return (
    <div className={style.Loader}>
      <div className={style.first}/>
      <div className={style.second}/>
    </div>
  )
}

export default Loader;
