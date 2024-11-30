import React, { useState, useEffect } from "react";
import axios from "axios";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip } from "react-tooltip";

const App = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [username, setUsername] = useState("your_lastfm_username"); // Replace with the actual Last.fm username
  const [year, setYear] = useState(2023); // Example year
  const [month, setMonth] = useState(11); // Example month (November)

  // Fetch heatmap data from the backend
  const fetchHeatmapData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/lastfm/heatmap", {
        params: { username, year, month },
      });

      const data = response.data;

      // Format the data for the heatmap
      const formattedData = data.map((day) => ({
        date: new Date(day.date),
        count: day.playCount, // Use play count for the intensity
        track: day.mostPlayedTrack, // Include the track name for tooltip
      }));

      setHeatmapData(formattedData); // Update the state with the data
    } catch (error) {
      console.error("Error fetching heatmap data:", error.message);
    }
  };

  useEffect(() => {
    fetchHeatmapData();
  }, [username, year, month]); // Re-fetch data when username, year, or month changes

  return (
    <div className="App">
      <h1>Music Heatmap</h1>
      
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
        <Tooltip />
      </div>
    </div>
  );
};

export default App;


