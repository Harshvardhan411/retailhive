import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

/**
 * Logs user actions to Firestore for analytics and debugging
 * @param action - The action being performed
 * @param data - Additional data related to the action
 */
export async function logAction(action: string, data: Record<string, unknown>): Promise<void> {
  try {
    const logRef = collection(db, 'userLogs');
    await addDoc(logRef, {
      action,
      data,
      timestamp: new Date().toISOString(),
      userId: 'system' // Replace with actual user ID when authentication is implemented
    });
  } catch (error) {
    console.error('Error logging action:', error);
  }
} 