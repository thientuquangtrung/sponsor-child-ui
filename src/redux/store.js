import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { rootPersistConfig, rootReducer, rootMiddleware } from './rootReducer';

// ----------------------------------------------------------------------

const store = configureStore({
    reducer: persistReducer(rootPersistConfig, rootReducer),
    middleware: rootMiddleware,
});

const persistor = persistStore(store);

export { store, persistor };
