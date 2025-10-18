// Initialize an empty array to store the playlist
let playlists = [
  {
   name: "Default Playlist",
   songs: [] 
  }
]
// Variable to keep track of the current song index for modification
let currentPlaylistIndex = 0;
let currentSongIndex = null;

// ------------------------------
// Helper Section
// ------------------------------

function getSongsFromASpecifiedPlaylist(){
  return playlists[currentPlaylistIndex].songs;
}

// ------------------------------
// Business Logic Section
// ------------------------------

// Function to add a song to the playlist
function addSong(songName, artistName) {
  let songsfromplaylist = getSongsFromASpecifiedPlaylist();
  let song = {
    name: songName,
    artist: artistName
  };

  songsfromplaylist.push(song);
}

// Function to remove a song from the playlist
function removeSong(index) {
  let songsfromplaylist = getSongsFromASpecifiedPlaylist();
  songsfromplaylist.splice(index, 1);
}

// Function to get the song details for modification
function getSongDetails(index) {
  let songsfromplaylist = getSongsFromASpecifiedPlaylist();
  return songsfromplaylist[index];
}

// Function to modify a song in the playlist
function modifySong(index, songName, artistName) {
  
  let songsfromplaylist = getSongsFromASpecifiedPlaylist();
  if(index >= 0 & index <= songsfromplaylist.length)
  {
    let song = songsfromplaylist[index];
    song.name = songName;
    song.artist = artistName;
  }
  else
  {
    throw new Error("Invalid index. Song modification failed.");
  }

}

// Function to display the playlist
function displayPlaylist() {
  
let songsfromplaylist = getSongsFromASpecifiedPlaylist();

if(songsfromplaylist.length == 0)
{
  displayEmptyPlaylistMessage();
}
else if(songsfromplaylist.length > 0){
  displaySongs();
}

}

// ------------------------------
// Presentation Logic Section
// ------------------------------

// Function to display the songs in the playlist
function displaySongs() {
  const songList = document.getElementById('song-list');
  // Clear the current list
  songList.innerHTML = '';
  
  // TODO: Iterate over the playlist and create a list item for each song
  getSongsFromASpecifiedPlaylist().forEach((song, index) => {
   let listItemm = createSongListItem(song, index);
   songList.appendChild(listItemm);
  });
}

// Function to handle form submission
function handleFormSubmit(event) {
  // Prevent the default form submission behavior
  event.preventDefault();
  
  // Get the values from the input fields and trim whitespace
  const songNameInput = document.getElementById('song-name');
  const artistNameInput = document.getElementById('artist-name');
  const songName = songNameInput.value.trim();
  const artistName = artistNameInput.value.trim();
  
  // TODO: Determine if the song if being added or modified

  if(currentSongIndex == null)
    {
      addSong(songName, artistName);
    }
    else
    {
      modifySong(currentSongIndex, songName, artistName);
    }

  // Clear form fields and update the display
  clearFormFields();
  displayPlaylist();
}

// Function to clear the form fields
function clearFormFields() {
  document.getElementById('song-name').value = '';
  document.getElementById('artist-name').value = '';
  updateFormTitle('Add a Song', 'Add Song');
  currentSongIndex = null;
}

// Function to display a message when the playlist is empty
function displayEmptyPlaylistMessage() {
  const songList = document.getElementById('song-list');
  songList.innerHTML = '';
  
  // Create a list item to display the empty playlist message
  const emptyMessage = document.createElement('li');
  emptyMessage.textContent = 'No songs in the playlist.';
  songList.appendChild(emptyMessage);
}

// Function to create a song list item with modify and remove actions
function createSongListItem(song, index) {
  const listItem = document.createElement('li');
  const songDetails = document.createElement('span');
  songDetails.textContent = `${song.name} - ${song.artist}`;
  listItem.appendChild(songDetails);
  
  const actionsDiv = document.createElement('div');
  actionsDiv.classList.add('song-actions');
  
  // Create and append the remove button
  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.addEventListener('click', () => {
    removeSong(index);
    displayPlaylist();
    clearFormFields();
    updateFormTitle('Add a Song', 'Add Song');
  });
  actionsDiv.appendChild(removeButton);
  
  // Create and append the modify button
  const modifyButton = document.createElement('button');
  modifyButton.textContent = 'Modify';
  modifyButton.addEventListener('click', () => {
    populateFormForModification(index);
    updateFormTitle('Modify a Song', 'Modify Song');
  });
  actionsDiv.appendChild(modifyButton);
  
  listItem.appendChild(actionsDiv);
  return listItem;
}

// Function to populate the form with song details for modification
function populateFormForModification(index) {
  const song = getSongDetails(index);
  document.getElementById('song-name').value = song.name;
  document.getElementById('artist-name').value = song.artist;
  currentSongIndex = index;
}

// Function to update the form title and button text
function updateFormTitle(title, buttonText) {
  document.getElementById('form-title').textContent = title;
  document.getElementById('form-button').textContent = buttonText;
}

// ------------------------------
// Playlist Management
// ------------------------------

function createPlaylist(name) {
  playlists.push({ name: name, songs: [] });
  currentPlaylistIndex = playlists.length - 1;
  updatePlaylistDropdown();
  displayPlaylist();
}

function switchPlaylist(index) {
  currentPlaylistIndex = index;
  displayPlaylist();
  clearFormFields();
}

function updatePlaylistDropdown() {
  const selector = document.getElementById("playlist-selector");
  selector.innerHTML = "";

  playlists.forEach((pl, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.innerHTML = pl.name;
    if (index == currentPlaylistIndex) 
    {option.selected = true;}
    selector.appendChild(option);
  });
}



// Function to initialize the app
function initializeApp() {
  let songForm = document.getElementById('song-form');
  songForm.addEventListener('submit', handleFormSubmit);

  let newplaylistbutton = document.getElementById('new-playlist-button');
  newplaylistbutton.addEventListener("click", (event) => {
    event.preventDefault();
    let pname = prompt("Enter new playlist name");
    if (pname) 
    {
      createPlaylist(pname)
    };
  });

  let switchplaylistbutton = document.getElementById('playlist-selector');
  switchplaylistbutton.addEventListener("change", (event) => {
    switchPlaylist(parseInt(event.target.value));
  });

  updatePlaylistDropdown();
  displayPlaylist();
}

// Check for Node.js environment to support testing or other non-browser environments
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    addSong,
    modifySong,
    removeSong,
    getSongDetails,
    displayPlaylist,
    handleFormSubmit,
    displaySongs,
    initializeApp,
    playlists, currentPlaylistIndex, currentSongIndex
  };
} else {
  // In a browser, initialize the app either after the document loads or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
}
