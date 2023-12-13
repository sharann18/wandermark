import {useEffect, useRef, useState} from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMapEvents } from 'react-leaflet/hooks'
import * as L from "leaflet";
import axios from 'axios';
import { format } from 'timeago.js';
import './App.css';
import { Star } from '@mui/icons-material';
import Register from './components/Register'
import Login from './components/Login'

function DoubleClickMap({ onMapDoubleClick }) {

  const handleDoubleClick = (e) => {
    onMapDoubleClick(e.latlng);
  };

  useMapEvents({
    dblclick: handleDoubleClick,
  });

  return null;
}

function App() {
  const LeafIcon = L.Icon.extend({
    options: {}
  });

  const blueMarker = new LeafIcon({
      iconUrl: '/blue-pointer.png',
      iconSize: [32, 36],
      iconAnchor: [12, 41],
      popupAnchor: [4, -34],
      shadowSize: [0, 0]
    });
  
  const redMarker = new L.Icon({
      iconUrl: '/red-pointer.png',
      iconSize: [32, 36],
      iconAnchor: [12, 41],
      popupAnchor: [4, -34],
      shadowSize: [0, 0]
    });
  
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(null);
  const [pins, setPins] = useState([]);
  const [viewport, setViewport] = useState({
     center : [28.8584,  2.2945],
     zoom : 3
  });
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(null);
  const [register, setRegister] = useState(null);

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("http://localhost:8800/api/pins");
        setPins(allPins.data);
      } catch (err) {
        console.log('internal server error');
      }
    };
    getPins();
  }, [newPlace]);

  const handleMapDoubleClick = (coordinates) => {

    setNewPlace({lat : coordinates.lat, long : coordinates.lng });

  };

  const handleAddPin = async (event) => {
    event.preventDefault();
    
    if(!title || !desc) {
      alert("Please verify if you have entered all the necessary details!");
    }

    const newPin = {
      username : currentUser,
      title : title,
      desc : desc,
      rating : rating,
      lat : newPlace.lat,
      long : newPlace.long 
    }

    try {
      const res = await axios.post("http://localhost:8800/api/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);

    } catch (err) {
      console.log("internal server error")
    }
  }

  const handleCancel = () => {
    setNewPlace(null);
    setTitle(null);
    setDesc(null);
    setRating(null);
  }

  const handleLoginBtnClick = () => {
    setRegister(false);
  }

  const handleRegisterBtnClick = () => {
    setRegister(true);
  }

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  }

  const handleDelete = async (pinId) => {
    try {
      const response = await axios.delete(`http://localhost:8800/api/pins/${pinId}`);
      
      console.log(response.data);
      

      setPins(prevPins => prevPins.filter(pin => pin._id !== pinId));
    } catch (error) {
      console.error('Error deleting pin:', error);
    }
  };

  return (
    <main className="main-container">
      {currentUser && (
          <div className="map-container">
          <MapContainer {...viewport} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
    
          <DoubleClickMap onMapDoubleClick={handleMapDoubleClick}/>
          {pins.map((pin) => (
            <div>
            <Marker position={[pin.lat, pin.long]} icon={currentUser === pin.username && redMarker || blueMarker}>
                <Popup className="card" >
                  <div className="card-div">
                    <label><b>Title</b></label>
                      <span className="card-place">{ pin.title }</span>
                    <label><b>Review</b></label>
                      <span>{ pin.desc }</span>
                    <label><b>Rating</b></label>
                      <div className="star-container">
                      {
                      Array.from({ length: pin.rating })
                      .map(() => (
                        <Star className="star" />
                      ))
                      }
                      </div>
                    <span className="card-username">Created by <b>{ pin.username }</b></span>
                    <span className="card-date"><b>{ format(pin.createdAt) }</b></span>
                    {currentUser === pin.username && (
                        <button type="submit" value="Delete" onClick={() => handleDelete(pin._id)} id="button-delete">Delete Pin</button>
                    )}
                  </div>
                </Popup>
            </Marker>
          </div>
          ))}
          { newPlace &&
            <Marker position={[newPlace.lat, newPlace.long]} icon={redMarker}>
                <Popup className="card">
                  <div>
                    <form className="form-div" onSubmit={handleAddPin}>
                    <label><b>Title</b></label>
                      <input placeholder="Enter a title" onChange={(event) => setTitle(event.target.value)}/>
                    <label><b>Review</b></label>
                      <textarea placeholder="Write a review"  
                      onChange={(event) => setDesc(event.target.value)}/>
                    <label><b>Rating</b></label>
                      <select onChange={(event) => setRating(event.target.value)}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    <button type="submit" value="Cancel" onClick={handleCancel} id="button-cancel" >Cancel</button>
                    <button type="submit" value="Submit">Add Pin</button>
                    </form>
                  </div>
                </Popup>
            </Marker>
          }
        </MapContainer>
        </div>
      )}
      {
        !currentUser && (
          <div>
            {
              register && <Register />
            }
            {
              !register && <Login myStorage={myStorage} setCurrentUser={setCurrentUser}/>
            }
          </div>
        )
      }
    {currentUser ? 
          (<button className="button logout" onClick={handleLogout}>Log out</button>) 
          : 
          (<div className="buttons">
            <button className="button login" onClick={handleLoginBtnClick}>Login</button>
            <button className="button register" onClick={handleRegisterBtnClick}>Register</button>
          </div>)}
  </main>
  );
}

export default App;