// ==UserScript==
// @name         Captcha Resolver Loin
// @namespace    http://tampermonkey.net/
// @version      2024-09-10
// @description  Resolve CAPTCHA images and find topmost elements
// @author       MR Tech
// @match        https://pakistan.blsspainglobal.com/Global/newcaptcha/logincaptcha*
// @grant       unsafeWindow
// ==/UserScript==

'use strict'

const captchaConfig = {
  enabled: 'on',
  apiKey: 'sufisevices-9d068610-f64b-dfc7-1088-76a154ca871f',
}

function solveCaptcha(autoSubmit) {
  if (!(/on|true/.test(captchaConfig.enabled) && captchaConfig.apiKey)) return

  const target = getCaptchaTarget();
  const grid = getCaptchaGrid();

  const extractCaptchaGridData = grid => Object.fromEntries(grid.map(img => img.src).entries());

  const onSuccess = result => {
    if (result.status === 'solved') {
      Object.entries(result.solution).forEach(([index, value]) => value === target && grid[index].click());
      if (autoSubmit) onSubmit();
    } else {
      onError('captchaerror', result);
    }
  };

  const onError = (type, data) => {
    console.error(type, data);
    $('.validation-summary-valid').html('<b>Failed to solve captcha.</b>');
  };

  $.post({
    url: 'https://pro.nocaptchaai.com/solve',
    headers: { apiKey: captchaConfig.apiKey },
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      method: 'ocr',
      id: 'morocco',
      images: extractCaptchaGridData(grid),
    }),
    timeout: 30_000,
    beforeSend() {
        this._loading = $(`
  <div class="d-flex align-items-center justify-content-center lead" style="
      background: linear-gradient(to bottom, rgba(255, 0, 0, 0.5), rgba(255, 0, 0, 0.7));
      border: 2px solid rgba(255, 215, 0, 0.8); /* Gold border */
      color: red; /* Red text */
      font-weight: bold;
      border-radius: 7px;
      padding: 10px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); /* Add shadow for depth */
      transition: transform 0.2s, box-shadow 0.2s;
  ">
    <span class="spinner-grow"></span>
    &nbsp;Solving captcha ...
  </div>
`).prependTo('.main-div-container');
    },
    complete(xhr, state) {
      this._loading?.remove();

      switch (state) {
        case 'success':
          onSuccess(xhr.responseJSON);
          break;
        case 'error':
        case 'parsererror':
          onError(state, xhr);
          break;
      }
    },
  });
}

function getCaptchaTarget() {
  return $('.box-label')
    .sort((a, b) => getComputedStyle(b).zIndex - getComputedStyle(a).zIndex)
    .first()
    .text()
    .replace(/\D+/, '');
}

function getCaptchaGrid() {
  return $(':has(> .captcha-img):visible').get()
    .reduce((acc, cur) => {
      (acc[Math.floor(cur.offsetTop)] ??= []).push(cur);
      return acc;
    }, [])
    .flatMap(sortedByTop => {
      const sortedByZIndex = sortedByTop.sort((a, b) => getComputedStyle(b).zIndex - getComputedStyle(a).zIndex);
      const top3 = sortedByZIndex.slice(0, 3); // max cells
      const sortedByLeft = top3.sort((a, b) => a.offsetLeft - b.offsetLeft);
      return sortedByLeft;
    })
    .map(element => element.firstElementChild);
}

// Example of using the function
$(document).ready(() => {
  // Assuming autoSubmit is a boolean determining whether to auto-submit after solving
  solveCaptcha(true);
});