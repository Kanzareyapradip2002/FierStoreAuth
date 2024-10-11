import { useEffect, useState } from 'react';
import { app } from "../firebase"; 
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    getFirestore,
    updateDoc,
} from "firebase/firestore";

const db = getFirestore(app); 

function Frome() {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
  });
  const [isChecked, setIsChecked] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

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

  const Submit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const collectionRef = collection(db, 'users'); 
      if (editIndex === null) {
        await addDoc(collectionRef, inputValue); 
      } else {
        const docRef = doc(collectionRef, items[editIndex].id); 
        await updateDoc(docRef, inputValue); 
        setEditIndex(null);
      }
      setInputValue({
        name: "",
        email: "",
        password: "",
        gender: "",
      });
      setIsChecked(false); 
      fetchItems(); 
    }
  };

  const fetchItems = async () => {
    const collectionRef = collection(db, 'users'); 
    const snapshot = await getDocs(collectionRef);
    const userData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })); 
    setItems(userData);
  };

  const DeleteData = async (index) => {
    const docRef = doc(db, 'users', items[index].id); 
    await deleteDoc(docRef); 
    fetchItems(); 
  };

  const EditData = (index) => {
    setInputValue(items[index]);
    setEditIndex(index);
  };

  useEffect(() => {
    fetchItems();
  }, []);

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
            <br /><br />
            <input
              type="email"
              placeholder='Enter The Email'
              value={inputValue.email}
              name='email'
              onChange={Input}
            />
            <br /><br />
            <input
              type="password"
              placeholder='Enter The Password'
              value={inputValue.password}
              name='password'
              onChange={Input}
            />
            <br /><br />
            <input
              type="radio"
              id="male"
              name='gender'
              value="Male"
              checked={inputValue.gender === "Male"}
              onChange={Input}
            />
            <label htmlFor="male">Male</label>
            <br /><br />
            <input
              type="radio"
              id="female"
              name='gender'
              value="Female"
              checked={inputValue.gender === "Female"}
              onChange={Input}
            />
            <label htmlFor="female">Female</label>
            <br /><br />
            <input
              type="checkbox"
              id='check'
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
            <label htmlFor="check">Accept Terms And Conditions</label>
            <br /><br />
            <button type='submit'>
              {editIndex === null ? "Add Data" : "Update Data"}
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
              {items.map((ele, index) => (
                <tr key={ele.id}>
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

export default Frome;
