import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import './App.css';
import Register from './pages/Register'
import PublicLayout from './layouts/PublicLayout'
import PrivateLayout from './layouts/PrivateLayout'
import Products from './pages/Products'
import RoleBasedRoute from './components/RoleBasedRoute'
import ProductAdmin from './pages/ProductsAdmin'
import Categories from './pages/Categories'
import Profil from './pages/profile/Profil'
import EditProfil from './pages/profile/EditProfil'
import ProfileLayout from './layouts/ProfileLayout'
import ChangePassword from './pages/profile/ChangePassword'
import Unit from './pages/Unit'
import Supplier from './pages/Supplier'
import Customer from './pages/Customer'
import Inbound from './pages/movements/Inbound'
import Outbound from './pages/movements/Outbound'
import Stock from './pages/report/Stock'
import InboundReport from './pages/report/InboundReport'
import OutboundReport from './pages/report/OutboundReport'
import Request from './pages/movements/Request'
import Processed from './pages/movements/Processed'
import RequestReport from './pages/report/RequestReport'
import UserData from './pages/manageData/UserData'
import AccessRights from './pages/manageData/AccessRights'
import Activity from './pages/manageData/Activity'

function App() {

  return (
    <>
      <div className='container'>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route element={<PrivateLayout />}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/products' element={<Products />} />
              <Route path='/profile' element={<ProfileLayout />}>
                <Route index element={<Profil />}/>
                <Route path='edit' element={<EditProfil />}/>
                <Route path='change-password' element={<ChangePassword />}/>
              </Route>
              <Route path='/stocks' element={<Stock />}/>
              <Route path='/request' element={<Request />}/>
              <Route path='/request-report' element={<RequestReport />}/>
              <Route element={<RoleBasedRoute allowedRoles={["Admin", "Super Admin"]}/>}>
                <Route path='/products-stock' element={<ProductAdmin />}/>
                <Route path='/categories' element={<Categories />} />
                <Route path='/units' element={<Unit />}/>
                <Route path='/suppliers' element={<Supplier />}/>
                <Route path='/customers' element={<Customer />}/>
                <Route path='/in-movements' element={<Inbound />}/>
                <Route path='/out-movements' element={<Outbound />}/>
                <Route path='/in-report' element={<InboundReport />}/>
                <Route path='/out-report' element={<OutboundReport />}/>
                <Route path='/req-movements' element={<Processed />}/>
              </Route>
              <Route element={<RoleBasedRoute allowedRoles={["Super Admin"]}/>}>
                <Route path='/users' element={<UserData />}/>
                <Route path='/roles' element={<AccessRights />}/>
                <Route path='/activities' element={<Activity />}/>
              </Route>
            </Route>
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App
