import type { NextApiRequest, NextApiResponse } from 'next';
import connection from '../../lib/db';
import bcrypt from 'bcrypt';

interface User {
  id: number;
  username: string;
  password: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      const [rows]: [User[]] = await connection.query(
        'SELECT * FROM users WHERE username = ?', 
        [username]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = rows[0];
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      const { password: _, ...userWithoutPassword } = user;

      res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
