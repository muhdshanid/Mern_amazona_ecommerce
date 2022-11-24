import { Routes, Route, BrowserRouter, Link } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import {
  Badge,
  Button,
  Container,
  Dropdown,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useContext } from "react";
import { Store } from "./Store";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SignupScreen";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShippingScreen from "./screens/ShippingScreen";
import SignupScreen from "./screens/SignupScreen";
import SigninScreeen from "./screens/SigninScreeen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { useState } from "react";
import { useEffect } from "react";
import { getError } from "./util";
import axios from "axios";
import SearchBox from "./Components/SearchBox";
import SearchScreen from "./screens/SearchScreen";
import ProtectedRoute from "./Components/ProtectedRoute";
import DashboardScreen from "./screens/DashboardScreen";
import AdminRoute from "./Components/AdminRoute";
function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (error) {
        toast.error(getError(error));
      }
    };
    fetchCategories();
  }, []);
  const { cart, userInfo } = state;
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };
  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? "d-flex flex-column site-container active-cont"
            : "d-flex flex-column site-container"
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header className="header-part">
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Button
                variant="dark"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>amazona</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto w-100 justify-content-end">
                  <Link
                    style={{ color: "white", marginTop: "2px" }}
                    to={"/cart"}
                    className="nav-link"
                  >
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <Dropdown>
                      <Button
                        style={{
                          background: "transparent",
                          border: "none",
                          paddingTop: "10px",
                        }}
                        variant="secondary"
                      >
                        {userInfo.name}
                      </Button>

                      <Dropdown.Toggle
                        style={{
                          background: "transparent",
                          border: "none",
                          paddingTop: "10px",
                        }}
                        split
                        variant="secondary"
                        id="dropdown-button-dark-example1"
                      />

                      <Dropdown.Menu>
                        <Dropdown.Item href="/profile">
                          User Profile
                        </Dropdown.Item>
                        <Dropdown.Item href="/orderhistory">
                          {" "}
                          Order History
                        </Dropdown.Item>
                        <Dropdown.Item onClick={signoutHandler} href="#signout">
                          {" "}
                          Sign Out
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : (
                    <Link className="nav-link" to={"/signin"}>
                      {" "}
                      Sign In{" "}
                    </Link>
                  )}
                  {userInfo && userInfo.isAdmin && (
                    <Dropdown id="admin-nav-dropdown">
                    <Button
                      style={{
                        background: "transparent",
                        border: "none",
                        paddingTop: "10px",
                      }}
                      variant="secondary"
                    > Admin
                    </Button>

                    <Dropdown.Toggle
                      style={{
                        background: "transparent",
                        border: "none",
                        paddingTop: "10px",
                      }}
                      split
                      variant="secondary"
                      id="dropdown-button-dark-example1"
                    />

                    <Dropdown.Menu>
                      <Dropdown.Item href="/admin/dashboard">
                        Dashboard
                      </Dropdown.Item>
                      <Dropdown.Item href="/admin/productlist">
                        {" "}
                        Products
                      </Dropdown.Item>
                      <Dropdown.Item href="/admin/orderlist">
                        {" "}
                       Orders
                      </Dropdown.Item>
                      <Dropdown.Item href="/admin/userlist">
                        {" "}
                       Users
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sidebarIsOpen
              ? "active-nav side-navbar d-flex justify-content-between flex-wrap flex-column"
              : "side-navbar d-flex jusstify-content-between flex-wrap flex-column"
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={`/search?category=${category}`}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container className="mt-4">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreeen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/shipping" element={<ShippingScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/search" element={<SearchScreen />} />
             {/* Admin Routes */}
             <Route path="/admin/dashboard" element={<AdminRoute><DashboardScreen/></AdminRoute>} />
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center mt-5">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
