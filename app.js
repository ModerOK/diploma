import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [user, setUser] = useState(null); // Стан для зберігання даних користувача
  const [files, setFiles] = useState([]); // Стан для зберігання списку файлів

  useEffect(() => {
    fetchUserData();
    fetchUserFiles();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/user'); // Виконання GET-запиту до маршруту '/user'
      setUser(response.data); // Оновлення стану користувача з отриманими даними
    } catch (error) {
      console.log('Помилка отримання даних користувача:', error);
    }
  };

  const fetchUserFiles = async () => {
    try {
      const response = await axios.get('/files'); // Виконання GET-запиту до маршруту '/files'
      setFiles(response.data); // Оновлення стану файлів з отриманими даними
    } catch (error) {
      console.log('Помилка отримання файлів користувача:', error);
    }
  };

  return (
    <div>
      {user && <h1>Привіт, {user.name}!</h1>} // Виведення привітання, якщо користувач визначений
      <h2>Твої файли:</h2>
      <ul>
        {files.map((file) => (
          <li key={file.id}>{file.name}</li> // Виведення списку файлів
        ))}
      </ul>
    </div>
  );
};

export default App;
