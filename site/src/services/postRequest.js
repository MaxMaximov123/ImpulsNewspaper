// import { config } from '../config.js';

export const apiHost = 0 ? 'http://localhost:8081/' : 'https://impulse131.ru/';

export function postRequest(url, data) {
    return new Promise((resolve, reject) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify(data)
    };
    
    fetch(url, options)
    .then(response => response.json())
    .then(result => {
        resolve(result);
    })
    .catch(error => {
        reject(error);
    });
    })
  }