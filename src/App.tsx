import './App.css';
import { useState } from 'react';

interface Note {
  id: number;
  title: string;
  content: string;
}

const App = () => {

  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: 'note title 1',
      content: 'content 1',
    },
    {
      id: 2,
      title: 'note title 2',
      content: 'content 2',
    },
    {
      id: 3,
      title: 'note title 3',
      content: 'content 3',
    },
    {
      id: 4,
      title: 'note title 4',
      content: 'content 4',
    }
  ]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [selectedNote, setSelectedNote] = useState<Note | null >(null);

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();

    const newNote: Note = {
      id: notes.length + 1,
      title: title,
      content: content
    }

    setNotes([newNote, ...notes]);
    setTitle("");
    setContent("");
  };

  const handleUpdateNote = (e: React.FormEvent) => {
    e.preventDefault();

    if(!selectedNote) {
      return 
    }

    const updateNote: Note = {
      id: selectedNote.id,
      title: title,
      content: content,
    };

    const updateNotesList = notes.map((note) => 
    note.id === selectedNote.id ? updateNote : note);

    setNotes(updateNotesList)
    setTitle("")
    setContent("");
    setSelectedNote(null);
  };

  const handleCancel = () => {
    setTitle("")
    setContent("");
    setSelectedNote(null);
  };

  const deleteNote = (e: React.MouseEvent, noteId: number) => {
      e.stopPropagation();

      const updateNotes = notes.filter(note => note.id !== noteId)

      setNotes(updateNotes);
  };

  return(
    <div className='app-container'>
      <form className='note-form' 
      onSubmit={(e) => selectedNote ? handleUpdateNote(e) : handleAddNote(e)}>
        
        <input value={title}
        onChange={(e) => setTitle(e.target.value)}
         placeholder='Titulo' 
         required />

        <textarea 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder='Conteúdo' 
        rows={10} 
        required>
        </textarea>

        {selectedNote ? (
          <div className='edit-buttons'>
            <button type='submit'>Salvar</button>
            <button onClick={handleCancel}>Cancelar</button>
          </div>
        ) : (
          <button type='submit'>Adicionar Nota</button>
        )}

      </form>

      <div className='notes-grid'>
        {notes.map((note) => (
          <div className='note-item'
          onClick={() => handleNoteClick(note)}
          >
          <div className='notes-header'>
            <button onClick={(e) => 
              deleteNote(e, note.id)
            }>X</button>
          </div>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
        </div>
        ))}
      </div>
    </div>
  )
};

export default App