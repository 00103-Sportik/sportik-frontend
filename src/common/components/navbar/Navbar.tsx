import { Menu } from '../menu/Menu.tsx';
import { useState } from 'react';
import { discardWorkoutInfo } from '../../../store/workouts/workouts.slice.ts';
import { useAppDispatch } from '../../../store/hooks.ts';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();

  const menu = () => {
    const menuBtn = document.querySelector('.menu-btn') as Element;
    const menu = document.querySelector('.menu') as Element;
    menuBtn.classList.toggle('menu-btn-open');
    menu.classList.toggle('menu-ul-open');
    setIsOpen(!isOpen);
  };

  return (
    <nav className="nav">
      <a href="/" className="@apply z-[3]" onClick={() => dispatch(discardWorkoutInfo())}>
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
