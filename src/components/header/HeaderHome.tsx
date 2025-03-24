import React from 'react';
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHouse} from "@fortawesome/free-solid-svg-icons";


const HeaderHome = () => {
  return (
    <header>
      <div className="container">
        <div className="header_wrapper">
          <Link href="/main">
            {/*<h1>중앙청과 20번</h1>*/}
            <h1>테스트</h1>
          </Link>
          <div className="btn-area">
            <Link href="/main" className="default">
              <FontAwesomeIcon icon={faHouse} className="icon"/>
              홈으로
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderHome;
