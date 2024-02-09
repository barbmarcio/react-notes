import { ChangeEvent, useState } from "react";
import logo from "./assets/logo-nlw-expert.svg";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Note[]>(() => {
    if (localStorage.getItem("notes")) {
      return JSON.parse(localStorage.getItem("notes") as string) as Note[];
    }

    return [];
  });

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearch(query);
  };

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : notes;

  const onNoteCreate = (noteContent: string) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      date: new Date(),
      content: noteContent,
    };

    const listOfNotes = [newNote, ...notes];

    setNotes(listOfNotes);
    localStorage.setItem("notes", JSON.stringify([newNote, ...notes]));
  };

  const onNoteDelete = (id: string) => {
    const newNotesArray = notes.filter((note) => note.id !== id);
    setNotes(newNotesArray);

    localStorage.setItem("notes", JSON.stringify(newNotesArray));
  };

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={logo} alt="NLW Expert" />

      <form className="w-full">
        <input
          type="text"
          placeholder="Search in your notes..."
          className="w-full bg-transparent text-3xl font-semibold outline-none tracking-tight placeholder:text-slate-500"
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreate={onNoteCreate} />
        {filteredNotes.map((note) => {
          return (
            <NoteCard key={note.id} note={note} onNoteDelete={onNoteDelete} />
          );
        })}
      </div>
    </div>
  );
}
