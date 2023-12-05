import { Menu } from '../menu/Menu.tsx';
import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menu = () => {
    const menuBtn = document.querySelector('.menu-btn') as Element;
    const menu = document.querySelector('.menu') as Element;
    menuBtn.classList.toggle('menu-btn-open');
    menu.classList.toggle('menu-ul-open');
    setIsOpen(!isOpen);
  };

  return (
    <nav className="nav">
      <a href="/">
        <p>Sportik+</p>
      </a>
      <button className="menu-btn" onClick={menu}>
        <span className="span top-1"></span>
        <span className="span top-2 hidden"></span>
        <span className="span top-2 hidden"></span>
        <span className="span top-3"></span>
      </button>
      <Menu />
    </nav>
  );
}
