import type { NextApiRequest, NextApiResponse } from 'next';
import connection from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, title } = req.body;

    try {
      await connection.query('INSERT INTO tasks (userId, title) VALUES (?, ?)', [userId, title]);
      res.status(200).json({ message: 'Task added successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error adding task', error });
    }
  } else if (req.method === 'GET') {
    const { userId } = req.query;

    try {
      const [tasks] = await connection.query('SELECT * FROM tasks WHERE userId = ?', [userId]);
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks', error });
    }
  } else if (req.method === 'DELETE') {
    const { taskId } = req.query;

    try {
      await connection.query('DELETE FROM tasks WHERE id = ?', [taskId]);
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting task', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
