import React, { useState, useEffect } from "react";
import "./List.scss";
import { Note } from "../Note/Note";
import dataItems from "../../db.json";
import {
  getDataFromLocalStorage,
  setDataToLocalStorage,
} from "../../LocalStorageService/LocalStorageHelper";

type Listprops = {
  newNoteName: string;
  clearNoteInput: () => void;
  newFilterWord: string;
  clearFilterInput: () => void;
};
export interface DataItem {
  id: number;
  name: string;
  tags: string[];
}

export const List = ({
  newNoteName,
  newFilterWord,
  clearNoteInput: clearInput,
  clearFilterInput,
}: Listprops) => {

  const [data, setData] = useState<DataItem[]>(getDataFromLocalStorage() || dataItems);
  
  useEffect(() => {
    setDataToLocalStorage(data);
  }, [data]);

  useEffect(() => {
    if (newNoteName) {
      const updatedData = [...data];
      updatedData.push({
        id: getNewId(updatedData),
        name: newNoteName,
        tags: [],
      });
      setData(updatedData);
      clearInput();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newNoteName]);

  useEffect(() => {
    if (newFilterWord) {
      const updatedData = [...data];
      setData(updatedData.filter((elem) => elem.tags.includes(newFilterWord)));
      clearFilterInput();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newFilterWord]);

  const getNewId = (data: DataItem[]): number => {
    return (
      data.reduce((maxId, note) => {
        const currId = note.id;
        return currId > maxId ? currId : maxId;
      }, 0) + 1
    );
  };

  const getNoteIndexById = (id: number) => {
    return data.findIndex((elem) => elem.id === id);
  };

  const removeNote = (id: number) => {
    setData(data.filter((elem) => elem.id !== id));
  };

  const removeTag = (id: number, index: number) => {
    const noteIndex = getNoteIndexById(id);
    if (noteIndex !== -1) {
      const updatedNote = { ...data[noteIndex] };
      updatedNote.tags.splice(index, 1);
      const updatedData = [...data];
      updatedData[noteIndex] = updatedNote;
      setData(updatedData);
    }
  };

  const changeNoteName = (id: number, value: string) => {
    const noteIndex = getNoteIndexById(id);
    if (noteIndex !== -1) {
      const updatedNote = { ...data[noteIndex] };
      updatedNote.name = value;
      const updatedData = [...data];
      updatedData[noteIndex] = updatedNote;
      setData(updatedData);
    }
  };

  const changeTagName = (id: number, value: string, index: number) => {
    const noteIndex = getNoteIndexById(id);
    if (noteIndex !== -1) {
      const updatedNote = { ...data[noteIndex] };
      updatedNote.tags[index] = value;
      const updatedData = [...data];
      updatedData[noteIndex] = updatedNote;
      setData(updatedData);
    }
  };

  const addNewTag = (id: number, value?: string) => {
    const noteIndex = getNoteIndexById(id);
    if (noteIndex !== -1) {
      const updatedData = [...data];
      if (value) {
        updatedData[noteIndex].tags.push(`#${value}`);
      } else {
        updatedData[noteIndex].tags.push("#");
      }
      setData(updatedData);
    }
  };

  return (
    <div className="list_wrapper">
      <div className="list">
        {data.map((elem) => {
          return (
            <Note
              key={elem.id}
              name={elem.name}
              tags={elem.tags}
              id={elem.id}
              cbRemoveNote={removeNote}
              cbRemoveTag={removeTag}
              cbChangeNoteName={changeNoteName}
              cbChangeTagName={changeTagName}
              cbAddNewTag={addNewTag}
            />
          );
        })}
      </div>
    </div>
  );
};
