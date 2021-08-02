import React, { useState, useMemo } from 'react'
import { FilesViewer } from './FilesViewer'
import * as XLSX from "xlsx";
import { ResultTable, TableViewer } from './TableViewer'
const fs = window.require('fs')
const pathModule = window.require('path')

const { app } = window.require('@electron/remote')

const formatSize = size => {
  var i = Math.floor(Math.log(size) / Math.log(1024))
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 +
    ' ' +
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  )
}

function App() {
  const [path, setPath] = useState(app.getAppPath())
  const [items, setItems] = useState([]);

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        let result = {};

        const labors = wb.SheetNames[2];
        const laborsSheet = wb.Sheets[labors];
        result[labors] = XLSX.utils.sheet_to_json(laborsSheet);

        const users = wb.SheetNames[5];
        const usersSheet = wb.Sheets[users];
        result[users] = XLSX.utils.sheet_to_json(usersSheet);

        const ticketsAttributes = wb.SheetNames[9];
        const ticketsAttributesSheet = wb.Sheets[ticketsAttributes];
        result[ticketsAttributes] = XLSX.utils.sheet_to_json(ticketsAttributesSheet);

        resolve(result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((result) => {
      setItems(result);
    });
  };
  // const files = useMemo(
  //   () =>
  //     fs
  //       .readdirSync(path)
  //       .map(file => {
  //         const stats = fs.statSync(pathModule.join(path, file))
  //         return {
  //           name: file,
  //           size: stats.isFile() ? formatSize(stats.size ?? 0) : null,
  //           directory: stats.isDirectory()
  //         }
  //       })
  //       .sort((a, b) => {
  //         if (a.directory === b.directory) {
  //           return a.name.localeCompare(b.name)
  //         }
  //         return a.directory ? -1 : 1
  //       }),
  //   [path]
  // )

  const onBack = () => {
    setPath(pathModule.dirname(path))
  }

  const onOpen = folder => setPath(pathModule.join(path, folder))

  const [searchString, setSearchString] = useState('')
  // const filteredFiles = files.filter(s => s.name.startsWith(searchString))

  return (
    <div className="container mt-2">
      <div className="flex-item">
        <input type="file" onChange={(e) =>{
          console.log("files---------", e.target.files[0].path)
          const file = e.target.files[0]
          const newPath = e.target.files[0].path
          setPath(newPath)
          readExcel(file)
        }}
        />
      </div>
      <h4>{path}</h4>
      {/*<div className="form-group mt-4 mb-2">*/}
      {/*  <input*/}
      {/*    value={searchString}*/}
      {/*    onChange={event => setSearchString(event.target.value)}*/}
      {/*    className="form-control form-control-sm"*/}
      {/*    placeholder="File search"*/}
      {/*  />*/}
      {/*</div>*/}
      {/*<FilesViewer files={filteredFiles} onBack={onBack} onOpen={onOpen} />*/}
      <TableViewer sheets={items} />
    </div>
  )
}

export default App
