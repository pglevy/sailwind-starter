import { Route, Router, Switch } from 'wouter'

// Import all pages
import Home from './pages/home'
import TaskDashboard from './pages/task-dashboard'
import ApplicationStatus from './pages/application-status'
import DocumentReview from './pages/document-review'
import NotFound from './pages/not-found'

// Page registry for automatic TOC generation
const pages = [
  { path: '/', title: 'Home', component: Home },
  { path: '/task-dashboard', title: 'Task Dashboard', component: TaskDashboard },
  { path: '/application-status', title: 'Application Status', component: ApplicationStatus },
  { path: '/document-review', title: 'Document Review', component: DocumentReview },
]

function App() {
  return (
    <Router base="/sailwind-starter">
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
