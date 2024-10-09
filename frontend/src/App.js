import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [file, setFile] = useState(null); // Хранение выбранного файла

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Получение загруженного файла
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setIsLoggedIn(true);
        setErrorMessage(null);
      } else {
        const data = await response.json();
        setErrorMessage(data.detail || 'Неверный логин или пароль');
      }
    } catch (error) {
      setErrorMessage('Ошибка сервера');
    }
  };

  const handleSubmitFile = async (event) => {
    event.preventDefault();

    if (!file) {
      setErrorMessage('Файл не выбран');
      return;
    }

    const formData = new FormData();
    formData.append('code_file', file); // Добавляем файл в formData

    try {
      const response = await fetch('http://127.0.0.1:8000/execute_file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        setErrorMessage('Ошибка загрузки файла');
      } else {
        setErrorMessage(null);
        alert('Файл успешно отправлен');
      }
    } catch (error) {
      setErrorMessage('Ошибка сервера при загрузке файла');
    }
  };

  if (isLoggedIn) {
    return (
      <div className="welcome-container">
        <h1>Добро пожаловать, {username}!</h1>
        <p>Вы успешно вошли в систему.</p>
        <form onSubmit={handleSubmitFile}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit" className="submit-btn">Загрузить файл</button>
        </form>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>
    );
  }

  return (
    <div className="login-container">
      <h1>Вход</h1>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Имя пользователя:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            className="input-field"
            placeholder="Введите имя"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className="input-field"
            placeholder="Введите пароль"
          />
        </div>
        <button type="submit" className="submit-btn">Войти</button>
      </form>
    </div>
  );
}

export default App;
