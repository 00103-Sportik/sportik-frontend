import { useAppDispatch } from '../../../store/hooks.ts';
import { logout } from '../../../store/auth/auth.slice.ts';
import { useState } from 'react';
import { Dialog, DialogDismiss } from '@ariakit/react';
import { useNavigate } from 'react-router-dom';
import styles from './Menu.module.css'

export function Menu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const exit = () => {
    dispatch(logout());
    navigate('/signin');
  };

  return (
    <>
      <ul className="menu">
        <li>
          <a href="/profile" className="menu-link">
            Profile
          </a>
        </li>
        <li>
          <a href="/hr-calc" className="menu-link">
            Heart Rate Calculator
          </a>
        </li>
        <li>
          <a href={undefined} onClick={() => setOpen(true)} className="menu-link @apply cursor-pointer">
            Sign out
          </a>
        </li>
      </ul>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        getPersistentElements={() => document.querySelectorAll('.Toastify')}
        backdrop={<div className="backdrop" />}
        className="dialog"
      >
        <p className={styles.p}>Are you sure?</p>
        <div className="flex gap-[10px]">
          <DialogDismiss className="btn-red" onClick={exit}>
            Sign out
          </DialogDismiss>
          <DialogDismiss className="btn-black">Back</DialogDismiss>
        </div>
      </Dialog>
    </>
  );
}
