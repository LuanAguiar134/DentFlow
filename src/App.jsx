import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PageNotFound from '@/lib/PageNotFound'
import AppLayout from '@/components/layout/AppLayout'
import Home from '@/pages/Home'
import Collection from '@/pages/Collection'
import ProductDetail from '@/pages/ProductDetail'
import NewArrivals from '@/pages/NewArrivals'
import About from '@/pages/About'
import Login from '@/pages/Login'

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/colecao" element={<Collection />} />
            <Route path="/produto/:id" element={<ProductDetail />} />
            <Route path="/novidades" element={<NewArrivals />} />
            <Route path="/sobre" element={<About />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App