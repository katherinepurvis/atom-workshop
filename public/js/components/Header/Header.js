import React from 'react';
import {Link, IndexLink} from 'react-router';

export default class Header extends React.Component {

  render () {
    return (
        <div className="toolbar">

          <header className="toolbar__container">
            <Link className="toolbar__title" href="/">
              <div className="toolbar__logo"></div>
              <div className="toolbar__page-icon"></div>
              <div className="toolbar__title__hover-state">
                <span className="toolbar__title__hover-state__subtitle">Back to</span><br />
                <span className="toolbar__title__hover-state__title">Dashboard</span>
              </div>
            </Link>
          </header>

          <div className="toolbar__container">
            <nav className="main-nav" role="navigation">
              <ul className="main-nav__list">
                <li className="toolbar__item main-nav__item">
                  Plain text
                </li>
                <li className="toolbar__item toolbar__item--no-spacing main-nav__item">
                  <a href="#" className="toolbar__button main-nav__link">Link 1</a>
                </li>
                <li className="toolbar__item toolbar__item--no-spacing main-nav__item">
                  <a href="#" className="toolbar__button main-nav__link">Link 2</a>
                </li>
                <li className="main-nav__item toolbar__item toolbar__item--no-spacing ">
                  <label className="toolbar__item__dropdown-label toolbar__button" >Toolbar dropdown
                    <select className="toolbar__item__dropdown">
                      <option value="#">Option 1</option>
                      <option value="#">Option 2</option>
                      <option value="#">Option 3</option>
                      <option value="#">Option 4</option>
                    </select>
                  </label>
                </li>
              </ul>
            </nav>
            <button className="toolbar__item toolbar__button">Button</button>
          </div>
        </div>
    );
  }
}
