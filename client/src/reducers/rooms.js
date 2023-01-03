import { createLocalStorageDispatch } from 'react-localstorage-hooks';

function removeRoom(rooms, idx) {
  return rooms.filter((_, i) => i !== idx);
}

/**
 * Reducer that returns new state of rooms list
 */
function roomsReducer(data, { type, payload }) {
  switch (type) {
    case 'remove-room':
      return { ...data, rooms: removeRoom(data.rooms, payload) };

    case 'add-room':
      const roomIdx = data.rooms.findIndex((room) => room.name === payload);
      const remainingRooms = removeRoom(data.rooms, roomIdx);

      const updatedRoom = roomIdx === -1 ? { name: payload } : data.rooms[roomIdx];

      return {
        ...data,
        rooms: [
          { ...updatedRoom, lastJoin: new Date().getTime() },
          ...remainingRooms,
        ],
      };

    default:
      return data;
  }
}

const dispatcher = createLocalStorageDispatch('blaze', roomsReducer);
export {  dispatcher as default, roomsReducer };
