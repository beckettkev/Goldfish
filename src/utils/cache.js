// Safari, in Private Browsing Mode, looks like it supports localStorage but all calls to setItem
// throw QuotaExceededError. We're going to detect this and just silently drop any calls to setItem
// to avoid the entire page breaking, without having to do a check at each usage of Storage.
if (typeof localStorage === 'object') {
  try {
    localStorage.setItem('localStorage', 1);
    localStorage.removeItem('localStorage');
  } catch (error) {
    Storage.prototype._setItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function setItem () {};

    console.log('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');
  }
}

function insertIntoArrayAtPosition (src, target, position) {
  const beginning = src.splice(0, position);
  const end = src.splice(position);

  return beginning.concat(target).concat(end);
}

//get local storage item if it is still valid
const fetch = (key) => {
    const cache = localStorage.getItem(key);

    const data = JSON.parse(cache);

    if (data && data.payload) {
      return data.payload;
    }

    return undefined;
};

//good citizen removal service function for deleting local storage entries
const remove = (key) => {
    localStorage.removeItem(key);
};

//vanilla local storage cache entry with a new key
const store = (key, payload) => {
    const data = { timestamp: Date.now(), payload: payload };

    localStorage.setItem(key, JSON.stringify(data));
};

//function for inserting into a pre-existing local storage item at a set position (to maintain the search results shape)
const insert = (key, items, position) => {
    let data = fetch(key);

    if (data.length > position) {
      //insert this page results to the correct position of the cache array
      data = {
          birthday: items.birthday,
          payload: insertIntoArrayAtPosition(data.payload, items.payload, position),
          sets: items.sets,
          count: items.count,
          term: items.term
      };
    } else {
      //add this page results to the end of the cache array
      data.payload = data.payload.concat(items.payload);
      data.sets = items.sets;
    }

    const combined = { timestamp: Date.now(), payload: data };

    localStorage.setItem(key, JSON.stringify(combined));
};

module.exports = {
  fetch: fetch,
  store: store,
  remove: remove,
  insert: insert
};
