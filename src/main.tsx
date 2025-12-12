import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data considered fresh
      gcTime: 24 * 60 * 60 * 1000, // 24 hours - cache retention time
    },
  },
})

// Create localStorage persister for query cache
const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'bmad-pokedex-cache',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours max cache age
        buster: 'v1', // Change to bust cache on new app versions
      }}
    >
      <App />
    </PersistQueryClientProvider>
  </StrictMode>
)
