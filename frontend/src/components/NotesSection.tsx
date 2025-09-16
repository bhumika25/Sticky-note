import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Note, Node } from "../types";
import { Input } from "./Input";
import { Badge } from "./Badge";


type NotesSectionProps = {
  node: Node;
  onRefresh: (node: Node) => void;
  onSelectNode: (node: Node) => void;
};

const NotesSection: React.FC<NotesSectionProps> = ({ node, onRefresh, onSelectNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newNote, setNewNote] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [searchText, setSearchText] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  // Voice recording
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Flatten notes recursively
  const flattenNotes = (node: Node): Note[] => {
    let allNotes: Note[] = node.notes || [];
    if (node.children) {
      node.children.forEach((child) => {
        allNotes = [...allNotes, ...flattenNotes(child)];
      });
    }
    return allNotes;
  };

  useEffect(() => {
    if (!node) return;
    setLoading(true);
    try {
      const allNotes = flattenNotes(node).sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setNotes(allNotes);
      setError(null);
    } catch {
      setError("Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, [node]);

  // Add Note
  const handleAddNote = async () => {
    const newTags = tagInput
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const allTags = [...tags, ...newTags];

    if (!newNote.trim() && !attachments.length && !audioBlob && allTags.length === 0) return;

    const formData = new FormData();
    formData.append("title", localStorage.getItem('role') || 'Admin');
    formData.append("structureId", String(node.id));
    formData.append("type", "text");
    formData.append("content", newNote);
    formData.append("tags", JSON.stringify(allTags)); // <-- use allTags here
    formData.append("timestamp", new Date().toString());

    attachments.forEach((file) => formData.append("attachments", file));
    if (audioBlob) formData.append("attachments_audio", new File([audioBlob], "voice_note.webm"));

    try {
      await axios.post("http://localhost:3001/notes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSelectNode(node)
      // Reset input fields
      setNewNote("");
      setAttachments([]);
      setAudioBlob(null);
      setTags([]);
      setTagInput("");
      onRefresh(node);
    } catch (err) {
      console.error(err);
      alert("Failed to add note");
    }
  };


  // Tags
  const addTag = () => {
    const input = tagInput.trim();
    if (!input) return;

    const newTags = input
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0); 

    setTags(prev => [...prev, ...newTags.filter(t => !prev.includes(t))]);

    setTagInput("");
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  // Attachments
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setAttachments([...attachments, ...Array.from(e.target.files)]);
  };
  const removeAttachment = (index: number) => {
    const newFiles = [...attachments];
    newFiles.splice(index, 1);
    setAttachments(newFiles);
  };

  // Voice Recording
  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Audio recording not supported");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
    mediaRecorder.onstop = () => setAudioBlob(new Blob(audioChunksRef.current, { type: "audio/webm" }));

    mediaRecorder.start();
    setRecording(true);
  };
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };
  const cancelRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    setAudioBlob(null);
  };

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const textMatch = note.content.toLowerCase().includes(searchText.toLowerCase());
    const tagMatch = tagFilter ? note.tags?.includes(tagFilter) : true;
    return textMatch && tagMatch;
  });

  return (
    <div className="mt-6 flex flex-col gap-6">
      {/* Add Note */}
      <div className="bg-white shadow rounded-lg p-4 flex flex-col gap-4">
        <Input
          type="textarea"
          value={newNote}
          onChange={(e: any) => setNewNote(e.target.value)}
          placeholder="Write a new note..."
          className="resize-none h-24"
        />

        {/* Tags */}
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Add a tag and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          />
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => removeTag(t)}
              >
                {t} ✕
              </Badge>
            ))}
          </div>
        </div>

        {/* Attachments */}
        <div className="flex flex-col gap-2">
          <input type="file" multiple onChange={handleFileChange} className="text-sm" />
          {attachments.map((file, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <span>{file.name}</span>
              <button className="text-red-500 font-bold" onClick={() => removeAttachment(idx)}>
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Voice Recording */}
        <div className="flex items-center gap-2">
          {!recording && !audioBlob && (
            <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={startRecording}>
              Record Voice
            </button>
          )}
          {recording && (
            <button className="bg-red-500 text-white px-4 py-1 rounded" onClick={stopRecording}>
              Stop
            </button>
          )}
          {audioBlob && (
            <div className="flex items-center gap-2">
              <audio controls src={URL.createObjectURL(audioBlob)} className="rounded" />
              <button className="text-red-500 font-bold" onClick={cancelRecording}>
                ×
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleAddNote}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-2"
        >
          Add Note
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2">
        <Input
          placeholder="Search notes..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Input
          placeholder="Filter by tag..."
          value={tagFilter || ""}
          onChange={(e) => setTagFilter(e.target.value || null)}
        />
      </div>

      {/* Notes List */}
      <div className="grid grid-cols-2 gap-4">
        {loading && <p>Loading notes...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && filteredNotes.length === 0 && <p className="text-gray-400 col-span-2">No notes available.</p>}

        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="bg-white shadow rounded-lg p-4 flex flex-col gap-2"
            style={{ width: "100%", height: "180px", overflowY: "auto" }} // fixed height
          >
            <div className="flex justify-between items-center">
              <span className="font-bold">Posted By: {note.title || "Admin"}</span>
              <span className="text-xs text-gray-400">{new Date(note?.createdAt).toLocaleDateString('en-GB')}</span>
            </div>
            <p className="truncate">Content: {note.content}</p>

            {note.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <p>Tags:</p>
                {note.tags.map((t: any) => (
                  <Badge key={t} variant="secondary">{t}</Badge>
                ))}
              </div>
            )}

            {note.attachments
              ?.filter((f: any) => f.type === "audio")
              .map((file: any, i: number) => (
                <audio key={i} controls>
                  <source src={`http://localhost:3001${file.url}`} type="audio/webm" />
                  Your browser does not support the audio element.
                </audio>
              ))}

            {note.attachments
              ?.filter((f: any) => f.type === "file")
              .map((file: any, i: number) => (
                <a
                  key={i}
                  href={`http://localhost:3001${file.url}`}
                  download={file.name}
                  target="_blank"
                  className="text-blue-600 underline cursor-pointer"
                >
                  {file.name}
                </a>
              ))}
          </div>
        ))}
      </div>

    </div>
  );
};

export default NotesSection;
