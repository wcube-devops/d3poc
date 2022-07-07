import React, {useEffect, useState} from 'react';
import './App.css';
import Papa from "papaparse"
import {ForceGraph} from "./components/forceGraph";

function App() {
  const [parsedData, setData] = useState({})
  const [isLoading, setLoading] = useState(true)
  useEffect(() => {
    async function getData() {
      let data = []
      const set = new Set()
      const response = await fetch('../data/test.csv')
      const reader = response.body.getReader()
      const result = await reader.read() // raw array
      const decoder = new TextDecoder('utf-8')
      const csv = decoder.decode(result.value) // the csv text
      const results = Papa.parse(csv) // ob
      let idx = 0
      let map = {}
      let links = []
      let dataParse = {}
      results.data.forEach(subArr => {
        for (let i = 0; i < subArr.length - 1; i++) {
          set.add(subArr[i])
        }
      })

      set.forEach((val) => {
        map[`${val}`] = idx
        let obj = {id: idx++, name: val}
        data.push(obj)
      })

      results.data.forEach(subArr => {
        for (let i = 0; i < subArr.length - 1; i += 2) {
          let key = subArr[i]
          let obj = {}
          obj.source = map[key]
          obj.target = map[subArr[i + 1]]
          obj.width = parseInt(subArr[i + 2])
          links.push(obj)
        }
      })
      dataParse.nodes = data
      dataParse.links = links
      setData(dataParse)
      setLoading(false)
    }

    getData()
  }, [])

  const hoverToolTip = React.useCallback((node) => {
    return `<div>     
      <b>${node.name}</b>
    </div>`;
  }, []);
  if (isLoading) {
    return <p>loading</p>
  }
  return (
    <div className="App">
      <ForceGraph linksData={parsedData.links} nodesData={parsedData.nodes} nodeHoverTooltip={hoverToolTip}/>
    </div>
  );
}

export default App;
