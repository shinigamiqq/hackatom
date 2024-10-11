import logo from './rosatom-logo.png';
import './App.css';
import React, { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [file, setFile] = useState(null);
  const [command, setCommand] = useState('');
  const [commandResult, setCommandResult] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleCommandChange = (event) => {
    setCommand(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost/api/login', {
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
    formData.append('code_file', file);

    try {
      const response = await fetch('http://localhost/api/execute_file', {
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

  const handleCommandSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost/api/reverse_shell/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({ code: command }),
      });

      if (response.ok) {
        const data = await response.json();
        setCommandResult(data.stdout || data.stderr);
      } else {
        setCommandResult('Ошибка выполнения команды');
      }
    } catch (error) {
      setCommandResult('Ошибка сервера при выполнении команды');
    }
  };

  return (
    <div className="app-container">
      {/* Шапка с логотипом */}
      <header className="header">
        <img src={logo} alt="Rosatom Logo" className="logo" />
        <h1>Rosatom Hub</h1>
      </header>

      {isLoggedIn ? (
        <div className="welcome-container">
          <h1>Добро пожаловать, {username}!</h1>
          <p>Вы успешно вошли в систему.</p>

          {/* Поле для ввода команды */}
          <form onSubmit={handleCommandSubmit} className="command-form">
            <input
              type="text"
              value={command}
              onChange={handleCommandChange}
              className="input-field"
              placeholder=""
            />
            <button type="submit" className="submit-btn">Поиск</button>
          </form>

          {/* Отображение результата выполнения команды */}
          {commandResult && (
            <div className="command-result">
              <h3>Результат поиска:</h3>
              <pre>{commandResult}</pre>
            </div>
          )}

          <form onSubmit={handleSubmitFile}>
            <input type="file" onChange={handleFileChange} />
            <button type="submit" className="submit-btn">Загрузить файл</button>
          </form>
          {errorMessage && <p className="error">{errorMessage}</p>}
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default App;
