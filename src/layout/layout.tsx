import Header from '@components/header/header'
import './layout.scss'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className='wrapper'>
      <Header />
      <Outlet />
    </div>
  )
}
