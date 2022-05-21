import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register('./sw.js')
//       .then(reg => {
//         console.log("Service worker registered!", reg);
//       })
//       .catch(e => {
//         console.log("Error!", e);
//       });
//   });
// }

// const addButton = document.querySelector('.todo-button');
// if (addButton) {
//   addButton.addEventListener("click", function () {
//     let todo: HTMLInputElement | null = document.querySelector('.todo-input')
    
//     if ("serviceWorker" in navigator) {
//       if (navigator.serviceWorker.controller) {
//         if (todo) {
//           navigator.serviceWorker.controller.postMessage({
//             title: todo.value
//           });
//         }
//       }
//     }
//   });
// }

