import { useEffect, useState } from "react";
import './index.css';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  arrayUnion
} from "firebase/firestore";

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

export default function StudentInfoApp() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    contact: ""
  });
  const [noteInput, setNoteInput] = useState("");

  const fetchStudents = async () => {
    const querySnapshot = await getDocs(collection(db, "students"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
      notes: arrayUnion(noteInput)
    });
    setNoteInput("");
    fetchStudents();
  };

  return (
    <div className="p-4 grid gap-4">
      <h1 className="text-2xl font-bold">生徒情報管理アプリ（クラウド連携版）</h1>

      <div className="grid gap-2 border p-4 rounded-2xl shadow">
        <Input
          placeholder="生徒の名前"
          value={newStudent.name}
          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
        />
        <Input
          placeholder="連絡先"
          value={newStudent.contact}
          onChange={(e) => setNewStudent({ ...newStudent, contact: e.target.value })}
        />
        <Button onClick={handleAddStudent}>生徒を追加</Button>
      </div>

      {students.map((student, index) => (
        <Card key={index} className="bg-white">
          <CardContent className="p-4 grid gap-2">
            <div className="text-xl font-semibold">{student.name}</div>
            <div className="text-sm text-gray-600">連絡先: {student.contact}</div>
            <div className="mt-2">
              <div className="font-semibold">相談内容：</div>
              <ul className="list-disc pl-5 text-sm">
                {student.notes && student.notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
              <div className="mt-2 flex gap-2">
                <Textarea
                  placeholder="相談内容を追加"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                />
                <Button onClick={() => handleAddNote(index)}>追加</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

    </div>
  );
}

export default App;
