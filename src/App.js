import { useEffect, useState } from "react";
import './App.css';

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  arrayUnion
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAaEGaXv_j5FDGuqeSUeXQjSHKBVMd5uus",
  authDomain: "studentlist-a0988.firebaseapp.com",
  projectId: "studentlist-a0988",
  storageBucket: "studentlist-a0988.firebasestorage.app",
  messagingSenderId: "615737664635",
  appId: "1:615737664635:web:3b84028d3c3864f7686ede",
  measurementId: "G-Y2KMK95HX8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: "", contact: "" });
  const [noteInput, setNoteInput] = useState("");

  const fetchStudents = async () => {
    const querySnapshot = await getDocs(collection(db, "students"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = async () => {
    if (newStudent.name) {
      await addDoc(collection(db, "students"), { ...newStudent, notes: [] });
      setNewStudent({ name: "", contact: "" });
      fetchStudents();
    }
  };

  const handleAddNote = async (index) => {
    const student = students[index];
    const docRef = doc(db, "students", student.id);
    await updateDoc(docRef, {
      notes: arrayUnion(noteInput),
    });
    setNoteInput("");
    fetchStudents();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>生徒情報管理アプリ（クラウド連携版）</h1>
      <input
        placeholder="生徒の名前"
        value={newStudent.name}
        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
      />
      <input
        placeholder="連絡先"
        value={newStudent.contact}
        onChange={(e) =>
          setNewStudent({ ...newStudent, contact: e.target.value })
        }
      />
      <button onClick={handleAddStudent}>生徒を追加</button>

      {students.map((student, index) => (
        <div key={index} style={{ border: "1px solid #ccc", padding: 10, marginTop: 10 }}>
          <h2>{student.name}</h2>
          <p>連絡先: {student.contact}</p>
          <h3>相談内容：</h3>
          <ul>
            {student.notes &&
              student.notes.map((note, i) => <li key={i}>{note}</li>)}
          </ul>
          <textarea
            placeholder="相談内容を追加"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
          />
          <button onClick={() => handleAddNote(index)}>追加</button>
        </div>
      ))}
    </div>
  );
}

export default App;
