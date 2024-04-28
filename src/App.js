import './App.css';
import { Analytics } from "@vercel/analytics/react"
import UserDiv from './function.js';
// Import UserDiv function here if it's in another file

function App() {
  return (
    <div className="App">
      <UserDiv /> {/* This is where the component is used */}
      <Analytics />
    </div>
  );
}

export default App;

  