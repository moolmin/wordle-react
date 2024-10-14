import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './app.scss'
import Landing from './routes/landing'
import Game from './routes/game'
import Layout from '@/layout/layout'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
        <Layout />
    ),
    children: [
      {
        path: '',
        element: <Landing />,
      },
      {
        path: 'game/:encodedWord', 
        element: <Game />,
      },
    ],
  },
])

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
