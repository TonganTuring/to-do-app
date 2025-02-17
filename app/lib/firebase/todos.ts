import { db } from './config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  updateDoc,
  deleteDoc,
  doc,
  orderBy
} from 'firebase/firestore';
import { Todo } from '@/app/types/todo';

const COLLECTION_NAME = 'todos';

export async function addTodo(userId: string, todo: Omit<Todo, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...todo,
      userId,
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...todo };
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
}

export async function getUserTodos(userId: string) {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Todo[];
  } catch (error) {
    console.error('Error getting todos:', error);
    throw error;
  }
}

export async function updateTodo(todoId: string, updates: Partial<Todo>) {
  try {
    const todoRef = doc(db, COLLECTION_NAME, todoId);
    await updateDoc(todoRef, updates);
    return { id: todoId, ...updates };
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
}

export async function deleteTodo(todoId: string) {
  try {
    const todoRef = doc(db, COLLECTION_NAME, todoId);
    await deleteDoc(todoRef);
    return todoId;
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
} 