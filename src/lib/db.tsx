import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'my_todo_app',
});

export default connection;
