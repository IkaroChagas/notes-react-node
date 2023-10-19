import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Note {
  id: number;
  title: string;
  content: string;
}

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const axiosInstance = axios.create({
    baseURL: 'https://notes-sever.onrender.com/api/notes',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axiosInstance.get('');
        setNotes(response.data);
      } catch (error) {
      }
    };
    fetchNotes();
  }, []);

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('', {
        title,
        content,
      });
      const newNote = response.data;
      setNotes([newNote, ...notes]);
      setTitle('');
      setContent('');
    } catch (error) {
    
    }
  };

  const handleUpdateNote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedNote) {
      return;
    }

    try {
      const response = await axiosInstance.put(`/${selectedNote.id}`, {
        title,
        content,
      });

      const updateNote = response.data;

      const updateNotesList = notes.map((note) =>
        note.id === selectedNote.id ? updateNote : note
      );

      setNotes(updateNotesList);
      setTitle('');
      setContent('');
      setSelectedNote(null);
    } catch (error) {
     
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setSelectedNote(null);
  };

  const deleteNote = async (e: React.MouseEvent, noteId: number) => {
    e.stopPropagation();

    try {
      await axiosInstance.delete(`/${noteId}`);
      const updateNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updateNotes);
    } catch (error) {
      
    }
  };

  return (
    <div className="app-container">
      <form
        className="note-form"
        onSubmit={(e) => (selectedNote ? handleUpdateNote(e) : handleAddNote(e))}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titulo"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Conteúdo"
          rows={10}
          required
        ></textarea>
        {selectedNote ? (
          <div className="edit-buttons">
            <button type="submit">Salvar</button>
            <button onClick={handleCancel}>Cancelar</button>
          </div>
        ) : (
          <button type="submit">Adicionar Nota</button>
        )}
      </form>
      <div className="notes-grid">
        {notes.map((note) => (
          <div className="note-item" onClick={() => handleNoteClick(note)}>
            <div className="notes-header">
              <button
                onClick={(e) => deleteNote(e, note.id)}
              >
                X
              </button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
