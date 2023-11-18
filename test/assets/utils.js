window.test = [];

/**
 *
 * @param {string} testId
 * @param {() => Promise<any>} cb
 */
export function setupTest(testId, cb) {
  window.test[testId] = () => {
    return cb();
  };
}

export function prepared() {
  const notifyElem = document.createElement('span');
  notifyElem.id = 'prepared';
  notifyElem.innerText = 'prepared';
  document.body.appendChild(notifyElem);
}
