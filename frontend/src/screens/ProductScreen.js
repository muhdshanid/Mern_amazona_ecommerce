import axios from "axios";
import React, { useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Card, Badge, Button } from "react-bootstrap";
import Rating from "../Components/Rating";
import {Helmet} from 'react-helmet-async'
import LoadingBox from "../Components/LoadingBox";
import MessageBox from "../Components/MessageBox";
import { getError } from "../util";
import { useContext } from "react";
import { Store } from "../Store";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ProductScreen = () => {
  const {state,dispatch:ctxDispatch} = useContext(Store)
  const {cart} = state;
  const navigate = useNavigate()
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((item) => item._id === product._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    const {data} = await axios.get(`/api/products/${product._id}`)
    if(data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({type:'CART_ADD_ITEM',payload:{...product,quantity}})
    navigate("/cart")
  }
  
  const params = useParams();
  const { slug } = params;
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    product: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchData();
  }, [slug]);
  return loading ? (
    <LoadingBox/>
  ) : error ? (
    <MessageBox variant={"danger"}>{error}</MessageBox>
  )  : (
    <div>
      <Row>
        <Col md={6}>
          <img
            style={{ height: "80vh" }}
            src={product.image}
            alt={product.name}
            className="img-large"
          />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating rating={product.rating} numReviews={product.numReviews} />
            </ListGroup.Item>
            <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
            <ListGroup.Item>
              Description :<p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                        <ListGroup.Item>
                          <div className="d-grid">
                            <Button variant="primary" onClick={addToCartHandler}> Add to Cart</Button>
                          </div>
                        </ListGroup.Item>
                      )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductScreen;
