import ReduxStoreProvider from './reduxStore.provider'
import TanstackRouterProvider from './tanstackRouter.provider'
import { ThemeProvider } from './theme.provider'
import TanstackQueryProvider, {
  getContext as getTanstackQueryContext,
} from '@/app/providers/tanstackQuery.provider'

const TanStackQueryProviderContext = getTanstackQueryContext()

export default function Providers() {
  return (
    <ReduxStoreProvider>
      <TanstackQueryProvider {...TanStackQueryProviderContext}>
        <ThemeProvider defaultTheme="dark" storageKey="miyabi-ui-theme">
          <TanstackRouterProvider />
        </ThemeProvider>
      </TanstackQueryProvider>
    </ReduxStoreProvider>
  )
}
