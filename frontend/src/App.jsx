import {
  BrowserRouter ,
  Route ,
  Routes
} from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Dashboard } from "./pages/Dashboard";
import { SendMoney } from "./pages/SendMoney";
import { Profile } from "./pages/Profile";
import { TransactionHistory } from "./components/TransactionHistory";

function App(){
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<SendMoney />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/transactions" element={<TransactionHistory />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}


// function App() {
//   return <h1 className="text-2xl text-green-500">This is working!</h1>;
// } this is just the beginning haha
//just checking


export default App