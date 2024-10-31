class Cookie {
    static set(name, value) {
        const date = new Date();
        date.setTime(date.getTime() + (10 * 365 * 24 * 60 * 60));
        const expires = "expires=" + date.toUTCString();
        document.cookie = `${name}=${value}; ${expires}; path=/`;
    }

    static get(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let c of ca) {
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    static erase(name) {
        document.cookie = `${name}=; Max-Age=-99999999; path=/`;
    }
}

export default class NotesAPI {
    static getAllNotes() {
        const notes = JSON.parse(Cookie.get("notesapp-notes") || "[]");
        return notes.sort((a, b) => new Date(b.updated) - new Date(a.updated));
    }

    static saveNote(noteToSave) {
        const notes = NotesAPI.getAllNotes();
        const existing = notes.find(note => note.id == noteToSave.id);

        if (existing) {
            existing.title = noteToSave.title;
            existing.body = noteToSave.body;
            existing.updated = new Date().toISOString();
        } else {
            noteToSave.id = Math.floor(Math.random() * 1000000);
            noteToSave.updated = new Date().toISOString();
            notes.push(noteToSave);
        }

        Cookie.set("notesapp-notes", JSON.stringify(notes), 7); // Guardar durante Forever días
        console.log("Notas guardadas:", JSON.stringify(notes));

    }

    static deleteNote(id) {
        const notes = NotesAPI.getAllNotes();
        const newNotes = notes.filter(note => note.id != id);
        Cookie.set("notesapp-notes", JSON.stringify(newNotes), 7);
        console.log("Notas guardadas:", JSON.stringify(notes));

    }
}
