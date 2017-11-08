import axios from './axios';

function get (options, offset) {
  return new Promise (function (resolve, reject) {
    let url = '/parsedData/5';
    let filter = {
      atos: options.atos || false,
      region: options.region || false,
      startDate: options.startDateMills || false,
      endDate: options.endDateMills || false,
      state : options.state || false,
      city: options.city || false,
      keywords: options.keywords.split(",").join("|") || false
    };

    axios.post(url, filter)
    .then(({ data }) => resolve(data))
    .catch(error => {
        console.log('Card get: ', error);
        reject(error);
    });
  });
}

/**
 * return all saved items
 * @param {*} options 
 * @param {*} offset 
 */
function findAllSaved (options, offset) {
  return new Promise (function (resolve, reject) {
    let url = '/feedbackList';
    let xhr = new XMLHttpRequest();

    axios.get(url)
    .then(({ data }) => resolve(data))
    .catch(error => {
        console.log('FindAllSaved: ', error);
        reject(error);
    });
  });
}

function save (card, { status, justification }) {
  return new Promise ((resolve, reject) => {
    let url = '/feedback';

    if (!card.feedbackData) {
      card.feedbackData = 'created';
    }

    card.feedbackStatus = status;
    card.manualAnalyseCause = justification;

    axios.post(url, card)
    .then(result => {
        console.log('save result', result);
        resolve(result);
    })
    .catch(error => {
        console.log('FindAllSaved: ', error);
        reject(error);
    });
  });
}

function deleteFeedback (card) {
  return new Promise ((resolve, reject) => {
    let url = '/feedback';

    axios.delete(url, card)
    .then(result => {
        resolve(result);
    })
    .catch(error => {
        console.log('Delete Feedback: ', error);
        reject(error);
    });
  });
}

export { get, save, findAllSaved, deleteFeedback };