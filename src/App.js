import { Routes, Route, BrowserRouter} from "react-router-dom";
import ShowInventario from './components/ShowInventario';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ShowInventario></ShowInventario>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
