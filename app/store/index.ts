import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { userReducer } from "./slices";


// ============================================================
// Persist Configurations
// ============================================================

/**
 * User persist config
 * Only persist user data, not loading/error states
 */
const userPersistConfig = {
    key: "user",
    storage,
    whitelist: ["user", "status"], // Persist user data and auth status
    blacklist: ["isHydrated", "error"], // Don't persist these
};

/**
 * Cart persist config
 */
const cartPersistConfig = {
    key: "cart-v2",
    storage,
};

// ============================================================
// Root Reducer
// ============================================================

const rootReducer = combineReducers({
		user: persistReducer(userPersistConfig, userReducer),
});

// ============================================================
// Store Configuration
// ============================================================

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
    devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

// ============================================================
// Type Exports
// ============================================================

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
