import { Routes, Route} from 'react-router-dom';
import FileUpload from './pages/FileUpload';
import FileView from './pages/FileView';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<FileUpload/>} />        
        {/* <Route path="/view" element={<FileView/>} />   */}
      </Routes>
    </div>
  );
}

export default App;
