import {Routes,Route,BrowserRouter, Link} from 'react-router-dom'
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from './screens/ProductScreen';
import {Badge, Button, Container, Dropdown, Nav, Navbar, NavDropdown} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import { useContext } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SignupScreen';
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ShippingScreen from './screens/ShippingScreen';
import SignupScreen from './screens/SignupScreen';
import SigninScreeen from './screens/SigninScreeen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen'
import ProfileScreen from './screens/ProfileScreen';
function App() {
  const {state,dispatch:ctxDispatch} = useContext(Store) 
  const {cart,userInfo} = state
  const signoutHandler = () => { 
    ctxDispatch({type:"USER_SIGNOUT"})
    localStorage.removeItem("userInfo")
    localStorage.removeItem("shippingAddress")
    localStorage.removeItem("cartItems")
    localStorage.removeItem("paymentMethod")
    window.location.href = '/signin'
  }
  return (
    <BrowserRouter>
    <div className='d-flex flex-column site-container'>
      <ToastContainer position='bottom-center' limit={1}/>
      <header className='header-part'>
        <Navbar bg='dark' variant='dark' expand='lg'>
          <Container>
            <LinkContainer to="/">
            <Navbar.Brand>amazona</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav' >
            <Nav className='me-auto w-100 justify-content-end'>
              <Link style={{color:"white",marginTop:"2px"}} to={"/cart"} className='nav-link'>
                Cart 
                {cart.cartItems.length > 0 && (
                  <Badge pill bg='danger'>
                    {cart.cartItems.reduce((a,c)=> a + c.quantity, 0)}
                  </Badge>
                )}
              </Link>
              { userInfo ? 
              <Dropdown >
              <Button style={{background:"transparent",border:"none",paddingTop:"10px"}} variant="secondary">{userInfo.name}</Button>
        
              <Dropdown.Toggle style={{background:"transparent",border:"none",paddingTop:"10px"}} split variant="secondary" id="dropdown-button-dark-example1" />
        
              <Dropdown.Menu>
                <Dropdown.Item href="/profile">User Profile</Dropdown.Item>
                <Dropdown.Item href="/orderhistory"> Order History</Dropdown.Item>
                <Dropdown.Item onClick={signoutHandler} href="#signout">  Sign Out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
               : 
                <Link className="nav-link" to={"/signin"}> Sign In </Link>
              }
            </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      <main>
        <Container className='mt-4'>
        <Routes>
          <Route path='/product/:slug' element={<ProductScreen/>} />
          <Route path="/" element={<HomeScreen/>}  />
          <Route path="/cart" element={<CartScreen/>}  />
          <Route path="/signin" element={<SigninScreeen/>}  /> 
          <Route path="/signup" element={<SignupScreen/>}  />
          <Route path='/shipping' element={<ShippingScreen/>} />
          <Route path='/payment' element={<PaymentMethodScreen/>} />
          <Route path='/placeorder' element={<PlaceOrderScreen/>} />
          <Route path='/order/:id' element={<OrderScreen/>} />
          <Route path='/orderhistory' element={<OrderHistoryScreen/>} />
          <Route path='/profile' element={<ProfileScreen/>} />
        </Routes> 
        </Container>
      </main>
      <footer>
        <div className='text-center mt-5'>All rights reserved</div>
      </footer>
      </div>
      </BrowserRouter>
  );
}

export default App;
