import './App.css';
import Signup from './Signup'; // Ensure this path points to the correct file
import Signin from "./Signin"; // This should point to the Signin component file
import Foodapi from "./Foodapi";
import Home from "./Home";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Toprated from './Toprated';
import Showitems from "./Showitems";
import Order from "./Order";
import Address from "./Address";
import ViewOrderItems from './ViewOrderItems';
import Menu from './Menu';
import Viewaddress from './Viewaddress';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/menu" element={<Menu/>} />
          <Route path="/foodapi" element={<Foodapi />} />
          <Route path="/addaddress" element={<Address />} />
          <Route path="/viewaddress" element={<Viewaddress />} />

          <Route path="/vieworders" element={<ViewOrderItems/>} />

          <Route path="/toprated" element={<Toprated/>} />
          <Route path="/order/:id" element= {<Order/>} />
          <Route path="/showitems/:name" element={<Showitems />} />


        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
