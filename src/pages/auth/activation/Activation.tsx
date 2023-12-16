import { useNavigate, useSearchParams } from 'react-router-dom';
import { useActivationMutation } from '../../../store/auth/auth.api.ts';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function Activation() {
  const navigate = useNavigate();
  const [check, setCheck] = useState(true);
  const [searchParams, _] = useSearchParams();
  const email = searchParams.get('email') || '';
  const activation_code = searchParams.get('activation_code') || '';
  const [activate, { isSuccess, error, isError }] = useActivationMutation();

  if (check) {
    setCheck(false);
    activate({ email, activation_code });
  }

  useEffect(() => {
    if (isSuccess) {
      navigate('/signin');
      toast('Activated successfully!', {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError && error) {
      navigate('/signin');
      toast.error('message' in error ? error && error.message : 'Activate failed!', {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  }, [error, isError]);

  return (
    <>
      <h1>Activate...</h1>
    </>
  );
}

export default Activation;
