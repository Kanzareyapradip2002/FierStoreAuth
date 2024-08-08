import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [item, setItem] = useState(() => {
    const storedData = localStorage.getItem("userData");
    return storedData ? JSON.parse(storedData) : [];
  });

  const [inputValue, setInputValue] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
  });

  const [isChecked, setIsChecked] = useState(false);
  const [edit, setEdit] = useState(null);

  const Input = (e) => {
    const { name, value } = e.target;
    setInputValue(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (inputValue.name === "") {
      alert("Please Enter Name");
      return false;
    } else if (inputValue.name.length <= 2) {
      alert("Name must be more than 2 characters");
      return false;
    } else if (inputValue.email === "") {
      alert("Please Enter an Email Address");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(inputValue.email)) {
      alert("Enter a Valid Email Address");
      return false;
    } else if (inputValue.password === "") {
      alert("Please Enter a Password");
      return false;
    } else if (inputValue.password.length <= 7) {
      alert("Password must be more than 7 characters");
      return false;
    } else if (!isChecked) {
      alert("Please Accept Terms And Conditions");
      return false;
    }
    return true;
  };

  const Submit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (edit === null) {
        setItem([...item, inputValue]);
      } else {
        const updatedData = [...item];
        updatedData[edit] = inputValue;
        setItem(updatedData);
        setEdit(null);
      }
      setInputValue({
        name: "",
        email: "",
        password: "",
        gender: "",
      });
      setIsChecked(false); // Reset checkbox after submit
    }
  };

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(item));
  }, [item]);

  const DeleteData = (index) => {
    const updatedData = item.filter((_, i) => i !== index);
    setItem(updatedData);
  };

  const EditData = (index) => {
    setInputValue(item[index]);
    setEdit(index);
  };

  return (
    <>
    <div className='Main'>
    <div className='Form'>
      <h1>Form</h1>
      <form onSubmit={Submit}>
        <input
          type="text"
          placeholder='Enter The Name'
          value={inputValue.name}
          name='name'
          onChange={Input}
        />
        <br />
        <br />
        <input
          type="email"
          placeholder='Enter The Email'
          value={inputValue.email}
          name='email'
          onChange={Input}
        />
        <br />
        <br />
        <input
          type="password"
          placeholder='Enter The Password'
          value={inputValue.password}
          name='password'
          onChange={Input}
        />
        <br />
        <br />
        <input
          type="radio"
          id="male"
          name='gender'
          value="Male"
          checked={inputValue.gender === "Male"}
          onChange={Input}
        />
        <label htmlFor="male">Male</label>
        <br />
        <br />
        <input
          type="radio"
          id="female"
          name='gender'
          value="Female"
          checked={inputValue.gender === "Female"}
          onChange={Input}
        />
        <label htmlFor="female">Female</label>
        <br />
        <br />
        <input
          type="checkbox"
          id='check'
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        />
        <label htmlFor="check">Accept Terms And Conditions</label>
        <br />
        <br />
        <button type='submit'>
          {edit === null ? "Add Data" : "Update Data"}
        </button>
      </form>      
      </div>
      <div className='Table'>
      <table border={1}>
        <thead>
          <tr>
            <td>Sr No</td>
            <td>Name</td>
            <td>Email</td>
            <td>Password</td>
            <td>Gender</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {item.map((ele, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{ele.name}</td>
              <td>{ele.email}</td>
              <td>{ele.password}</td>
              <td>{ele.gender}</td>
              <td>
                <button onClick={() => EditData(index)}>Edit</button>
                <button onClick={() => DeleteData(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </div>
    </>
  );
}

export default App;
