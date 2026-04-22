import { Route, Router, Switch } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'

import KanbanBoard from './pages/kanban-board'
import Home from './pages/home'
import NotFound from './pages/not-found'

const pages = [
  { path: '/', title: 'Kanban Board', component: KanbanBoard },
  { path: '/home', title: 'Home', component: Home },
]

function App() {
  return (
    <Router hook={useHashLocation}>
      <div className="min-h-screen bg-gray-50">
        <Switch>
          {pages.map(({ path, component: Component }) => (
            <Route key={path} path={path} component={Component} />
          ))}
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  )
}

export default App
