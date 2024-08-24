import { useAppDispatch } from '../../../store/hooks.ts';
import { logout } from '../../../store/auth/auth.slice.ts';
import { useState } from 'react';
import { Dialog, DialogDismiss } from '@ariakit/react';
import { useNavigate } from 'react-router-dom';
import { discardWorkoutInfo } from '../../../store/workouts/workouts.slice.ts';

export function Menu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const exit = () => {
    dispatch(discardWorkoutInfo());
    dispatch(logout());
    navigate('/signin');
  };

  return (
    <>
      <ul className="menu">
        <li>
          <a
            data-testid="profile-a"
            href="/profile"
            className="menu-link"
            onClick={() => dispatch(discardWorkoutInfo())}
          >
            Profile
          </a>
        </li>
        <li data-testid="hr-btn">
          <a data-testid="hr-a" href="/hr-calc" className="menu-link" onClick={() => dispatch(discardWorkoutInfo())}>
            HR Calculator
          </a>
        </li>
        <li>
          <a
            data-testid="signout-a"
            href={undefined}
            onClick={() => setOpen(true)}
            className="menu-link @apply cursor-pointer"
          >
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
        <p className="text-xl text-center align-middle table-cell mt-2.5">Are you sure?</p>
        <div className="flex gap-[10px]">
          <DialogDismiss data-testid="signout-btn" className="btn-red" onClick={exit}>
            Sign out
          </DialogDismiss>
          <DialogDismiss className="btn-black">Back</DialogDismiss>
        </div>
      </Dialog>
    </>
  );
}
