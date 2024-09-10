import type { NextApiRequest, NextApiResponse } from 'next';
import connection from '../../lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
      const [result] = await connection.query(
        'INSERT INTO users (username, password) VALUES (?, ?)', 
        [username, hashedPassword]
      );
      res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Registration failed', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
