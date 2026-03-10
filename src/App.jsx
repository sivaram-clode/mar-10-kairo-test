import { useState, useEffect } from 'react'

const STORAGE_KEY = 'notes-app-v1'

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function App() {
  const [notes, setNotes] = useState(loadNotes)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => saveNotes(notes), [notes])

  const selectedNote = notes.find(n => n.id === selectedId) ?? null

  function createNote() {
    if (!title.trim() && !body.trim()) return
    const note = {
      id: crypto.randomUUID(),
      title: title.trim() || 'Untitled',
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    const updated = [note, ...notes]
    setNotes(updated)
    setTitle('')
    setBody('')
    setSelectedId(note.id)
  }

  function deleteNote(id) {
    setNotes(notes.filter(n => n.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  return (
    <>
      <h1>📝 Notes</h1>

      {/* Compose */}
      <div className="compose">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          rows={3}
          placeholder="Write something…"
          value={body}
          onChange={e => setBody(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) createNote() }}
        />
        <div className="compose-actions">
          <button className="btn-primary" onClick={createNote}>Add Note</button>
        </div>
      </div>

      {/* Detail view */}
      {selectedNote && (
        <div className="note-detail">
          <div className="note-detail-header">
            <h2>{selectedNote.title}</h2>
            <button className="btn-danger" onClick={() => deleteNote(selectedNote.id)}>Delete</button>
          </div>
          <div className="note-detail-body">{selectedNote.body || <em style={{color:'#bbb'}}>No content</em>}</div>
          <div className="note-detail-meta">Created {formatDate(selectedNote.createdAt)}</div>
        </div>
      )}

      {/* List */}
      <div className="notes-list">
        {notes.length === 0 && <div className="empty">No notes yet. Create one above!</div>}
        {notes.map(note => (
          <div
            key={note.id}
            className={`note-card ${note.id === selectedId ? 'active' : ''}`}
            onClick={() => setSelectedId(note.id === selectedId ? null : note.id)}
          >
            <h2>{note.title}</h2>
            {note.body && <div className="preview">{note.body}</div>}
            <div className="meta">{formatDate(note.createdAt)}</div>
          </div>
        ))}
      </div>
    </>
  )
}
