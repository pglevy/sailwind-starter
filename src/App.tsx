import { Route, Router, Switch } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'

import GroceryList from './pages/grocery-list'
import NotFound from './pages/not-found'

const pages = [
  { path: '/', title: 'Grocery List', component: GroceryList },
]

function App() {
  return (
    <Router hook={useHashLocation}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <Switch>
            {pages.map(({ path, component: Component }) => (
              <Route key={path} path={path} component={Component} />
            ))}
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </Router>
  )
}

export default App
