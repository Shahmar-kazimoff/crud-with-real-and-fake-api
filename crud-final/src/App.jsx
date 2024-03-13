import { useState, useEffect } from "react";
import axios from 'axios';
import "./App.css"

function App() {
  const [data, setData] = useState([]);
  const [currentData, setCurrentData] = useState({
    id: "",
    companyName: "",
    contactName: "",
    contactTitle: "",
  })

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('https://northwind.vercel.app/api/suppliers').then(response => {
      setData(response.data);
    });
  };

  const handleSortById = () => {
    const yeniSiralama = [...data].sort((a, b) => a.id - b.id);
    setData(yeniSiralama);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (currentData.id) {
      updateCategory({ id: currentData.id, companyName: currentData.companyName, contactName: currentData.contactName, contactTitle: currentData.contactTitle })
    } else {
      addCategory({ companyName: currentData.companyName, contactName: currentData.contactName, contactTitle: currentData.contactTitle });
    }
  }

  const addCategory = (newCategory) => {
    axios.post('https://northwind.vercel.app/api/suppliers', newCategory).then(() => {
      fetchData();
      setCurrentData({ id: "", companyName: "", contactName: "", contactTitle: "" });
    })
  }

  const updateCategory = (updateCategory) => {
    axios.put(`https://northwind.vercel.app/api/suppliers/${updateCategory.id}`, updateCategory).then(() => {
      fetchData();
      setCurrentData({ id: "", companyName: "", contactName: "", contactTitle: "" });
    })
  }

  const handleInputCompanyChange = (e) => {
    setCurrentData({ ...currentData, companyName: e.target.value })
  }

  const handleInputContactChange = (e) => {
    setCurrentData({ ...currentData, contactName: e.target.value })
  }

  const handleInputTitleChange = (e) => {
    setCurrentData({ ...currentData, contactTitle: e.target.value })
  }

  const handleEdit = (supplier) => {
    setCurrentData(supplier)
  }

  const handleDelete = (id) => {
    axios.delete(`https://northwind.vercel.app/api/suppliers/${id}`).then(() => {
      fetchData()
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="form">
        <input type="text" name="name" value={currentData.companyName} onChange={handleInputCompanyChange} />
        <input type="text" name="company" value={currentData.contactName} onChange={handleInputContactChange} />
        <input type="text" name="contact" value={currentData.contactTitle} onChange={handleInputTitleChange} />
        <button type="submit">Add</button>
      </form>
      <table border={1}>
        <thead>
          <tr className="titles">
            <th onClick={handleSortById}>Id</th>
            <th>Company Name</th>
            <th>Contact Name</th>
            <th>Contact Title</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.companyName}</td>
              <td>{item.contactName}</td>
              <td>{item.contactTitle}</td>
              <td className="operations">
                <button onClick={() => handleEdit({ id: item.id, companyName: item.companyName, contactName: item.contactName, contactTitle: item.contactTitle })}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
