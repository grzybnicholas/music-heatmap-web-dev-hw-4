import React, { useState, useEffect } from "react";
import axios from "axios";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip } from "react-tooltip";

const App = () => {

  const [heatmapData, setHeatmapData] = useState([]);
  const [username, setUsername] = useState("hpwas");
  const [year, setYear] = useState(2023);
  const [month, setMonth] = useState(11);

  
  const fetchHeatmapData = async () => {
    try {
      
      const response = await axios.get("https://webdevhw4api-4011c781b962.herokuapp.com/lastfm/heatmap", {
        params: { username, year, month },
      });

      const data = response.data;

    
      const formattedData = data.map((day) => ({
        date: new Date(day.date),  
        count: day.playCount,      
        track: day.mostPlayedTrack,  
      }));

    
      setHeatmapData(formattedData);
    } catch (error) {
      console.error("Error fetching heatmap data:", error.message);
    }
  };


  useEffect(() => {
    fetchHeatmapData();
  }, [username, year, month]);

  return (
    <div className="App">
      <h1>Music Heatmap</h1>

      {/* Filters to input username, year, and month */}
      <div className="filters">
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}  
          />
        </label>
        <label>
          Year:
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}  
          />
        </label>
        <label>
          Month:
          <input
            type="number"
            value={month}
            onChange={(e) => setMonth(e.target.value)}  
            min="1"
            max="12"
          />
        </label>
      </div>

      {/* Display the heatmap with fetched data */}
      <div>
        <h2>{`${username}'s Music Heatmap (${month}/${year})`}</h2>

        <CalendarHeatmap
          startDate={new Date(`${year}-01-01`)}  
          endDate={new Date(`${year}-12-31`)}   
          values={heatmapData} 
          showMonthLabels={true}  
          tooltipDataAttrs={(value) => ({
            "data-tip": `Track: ${value.track} | Play count: ${value.count}`, 
          })}
          onClick={(value) => {
            if (value) {
              alert(`You played "${value.track}" ${value.count} times on ${value.date.toLocaleDateString()}`);
            }
          }}
        />

        {/* Tooltip component to display the tooltip */}
        <Tooltip />
      </div>
    </div>
  );
};

export default App;



