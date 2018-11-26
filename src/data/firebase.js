import app from 'firebase/app';
import 'firebase/database';
import { FirebaseConfig } from '../config';

class Firebase {
  constructor() {
    app.initializeApp(FirebaseConfig);
    this.database = app.database();
    this.ref = null;
  }

  setGroupRef(group) {
    this.ref = this.database.ref(group);
    return this;
  }

  addTrack(track) {
    this.ref.push(track);
  }

  removeTrack(trackId) {
    this.ref
      .child(trackId)
      .remove();
  }

  listenForTracks(callback) {
    this.ref
      .on('value', snapshot => {
        const val = snapshot.val();
        const tracks = val
          ? Object.entries(val).map(([id, obj]) => ({ id, ...obj }))
          : [];
        callback(tracks);
      });
  }

  removeGroupRef() {
    this.ref.off();
    this.ref = null;
  }
}

export default Firebase;
