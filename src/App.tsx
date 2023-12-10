import AppRoutes from './routes/routes.tsx';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store, { persistor } from './store/store.ts';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppRoutes />
          <ToastContainer position="top-center" autoClose={3000} />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
