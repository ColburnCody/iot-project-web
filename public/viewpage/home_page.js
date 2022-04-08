import * as Auth from '../controller/auth.js'
import * as Elements from './elements.js'
import * as Constants from '../model/constants.js'
import {
  attachRealtimeListener, initFirestoreDocs, updateDocForTreats,
} from '../controller/firestore_controller.js';

export let unsubRINOSASDoc = null;
const noMonitor = 'No monitor';

export function addEventListeners() {

  window.addEventListener('unload', e => {
    if (unsubRINOSASDoc) {
      unsubRINOSASDoc();
    }
  });

  Elements.buttonInitConfig.addEventListener('click', async e => {
    try {
      await initFirestoreDocs();
      alert('Firestore collection initialized!')
    } catch (e) {
      console.log(`Init Config error:\n${e}`);
      alert(`Init Config error:\n${e}`);
    }
  });

}

export function home_page() {
  if (!Auth.currentUser) {
    Elements.root.innerHTML = `
        <h3>Not Signed In</h3>
    `;
    return;
  }

  let html = '<h3 class="d-flex justify-content-center m-3">Control Panel<h3>';
  html += `
  <div style="background-color:rgb(245,245,220);">
    <div class="d-flex justify-content-start">
      <h5>Start monitor:</h5>
      <button id="button-monitor-button-status" type="input" class="btn btn-outline-primary ms-3">Start</button>
      <br>
    </div>
  </div>
  <div>
      <label id="treat-monitor-label" style="display: none;">No requests</label>
      </div>
  <br>
  <div>
  <button id="approve-button" type="input" class="btn btn-outline-primary">Approve</button>
      <button id="deny-button" type="input" class="btn btn-outline-danger">Deny</button>
  </div>
  `;


  Elements.root.innerHTML = html;

  const statusMonitorButton = document.getElementById('button-monitor-button-status');
  statusMonitorButton.addEventListener('click', e => {
    const label = e.target.innerHTML;
    if (label == 'Start') {
      e.target.innerHTML = 'Stop';
      const treatLabel = document.getElementById('treat-monitor-label')
      treatLabel.style.display = "block";
      // listen to Firestore doc changes
      unsubCameraDoc = attachRealtimeListener(Constants.COLLECTION,
        Constants.DOC_RINOSAS, rinosasListener);
    } else {
      e.target.innerHTML = 'Start';
      const treatLabel = document.getElementById('treat-monitor-label');
      treatLabel.style.display = "none";
      if (unsubRINOSASDoc) unsubRINOSASDoc();
    }
  });


  const approveButton = document.getElementById('approve-button')
  approveButton.addEventListener('click', e => {
    updateDocForTreats({ approval: "approved", request: false })
  })

  const denyButton = document.getElementById('deny-button')
  denyButton.addEventListener('click', e => {
    updateDocForTreats({ approval: "denied", request: false })
  })

}

function rinosasListener(doc) {
  const treatDoc = doc.data();
  const treatLabel = document.getElementById('treat-monitor-label');
  if (treatDoc['request'] == true) {
    treatLabel.innerHTML = 'Remi requires a treat';
  } else if (treatDoc['request'] == false) {
    treatLabel.innerHTML = 'No requests';
  }
}