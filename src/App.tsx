import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './app.scss'
import Landing from './routes/landing'
import Game from './routes/game'

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        path: '',
        element: <Landing />,
      },
      {
        path: 'game',
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
