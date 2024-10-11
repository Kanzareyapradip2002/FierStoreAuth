import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase';
import Frome from './Frome'; 

const auth = getAuth(app);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault(); 
    if (isSignUp) {
      createUserWithEmailAndPasswordHandler();
    } else {
      signInWithEmailAndPasswordHandler();
    }
  };

  const createUserWithEmailAndPasswordHandler = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('User created successfully');
      setEmail("");
      setPassword("");
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Error creating user:', error.message);
    }
  };

  const signInWithEmailAndPasswordHandler = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('User signed in successfully');
      setEmail("");
      setPassword("");
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Error signing in:', error.message);
    }
  };

  // If user is logged in, show the Home component
  if (loggedIn) {
    return <Frome />;
  } else {
    return (
      <div className='Main'>
        <div className="container">
          <div className="image">
            <h1>Welcome To <span>KPA MOVIES</span></h1>
          </div>
          <div className="content">
            <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} 
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className='logininput' htmlFor="email">Email:</label>
                <br />
                <input
                  className='logininput'
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  value={email}
                  placeholder="Enter An Email Id"
                  required
                />
              </div>
              <div className="form-group">
                <label className='logininput' htmlFor="password">Password:</label>
                <br />
                <input
                  className='logininput'
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  value={password}
                  required
                  placeholder="Enter A Password"
                />
              </div>
              <br />
              <button type="submit" className="btn">Create Account</button>
            </form>
            <button onClick={() => setIsSignUp(!isSignUp)} className="btn">
              {isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
