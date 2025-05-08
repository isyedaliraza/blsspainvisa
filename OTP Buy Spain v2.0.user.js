// ==UserScript==
// @name         OTP Buy Spain v2.0
// @namespace    http://tampermonkey.net/
// @version      2.0
// @author       Mr.uumar
// @match        https://mail.google.com/*
// @match        https://outlook.live.com/*
// @match        https://pakistan.blsspainglobal.com/*/blsAppointment*
// @match        https://pakistan.blsspainglobal.com/Global/blsAppointment
// @match        https://pakistan.blsspainglobal.com/Global/blsAppointment/ManageAppointment
// @grant        GM.setValue
// @grant        GM.getValue
// ==/UserScript==

if (window.location.href.startsWith("https://mail.google.com")) {
   // setTimeout(() => {
       // window.location.reload();
   // }, 20000);
  var _0x143bfb;
  function _0x4f7ee1() {
    const _0x4d6745 = document.querySelectorAll(".zE");
    if (_0x4d6745.length > 0) {
      const _0x81c222 = Math.min(_0x4d6745.length, 3);
      for (let _0x38b085 = 0; _0x38b085 < _0x81c222; _0x38b085++) {
        const _0x491137 = _0x4d6745[_0x38b085];
        const _0x77cd2c = _0x491137.querySelector(".bA4 span").textContent;
        if (/blsspainmorocco|blsinternation/.test(_0x77cd2c)) {
          _0x491137.click();
          _0x491137.classList.remove('zE');
          _0x143bfb = setInterval(_0x530e51, 500);
          break;
        }
      }
    }
  }
  function _0x530e51() {
    const _0x18bc1f = document.querySelector(".a3s");
    if (_0x18bc1f) {
      const _0x11daad = _0x18bc1f.innerHTML;
      if (_0x11daad) {
        const _0x48a567 = _0x11daad.match(/\b(\d{6})\b/);
        if (_0x48a567) {
          clearInterval(_0x143bfb);
          const _0x4dcec7 = _0x48a567[1];
          GM.setValue("code", _0x4dcec7);
          console.log(_0x4dcec7);
          const _0x254974 = document.querySelector(".nU.n1");
          if (_0x254974) {
            _0x254974.click();
          }
        }
      }
    }
  }
  setInterval(_0x4f7ee1, 500);
  _0x4f7ee1();
}
      if (window.location.href.indexOf("pakistan.blsspainglobal.com") > -1) {
        var _0x31629d;
        for (let _0x4aca8f = 1; _0x4aca8f <= 10; _0x4aca8f++) {
          const _0x19c343 = "AppointmentDate" + _0x4aca8f;
          const _0x83f9f1 = $('#' + _0x19c343);
          if (_0x83f9f1.is(":visible")) {}
        }
        var _0x8cd137 = ["AppointmentSlot1", "AppointmentSlot2", "AppointmentSlot3", "AppointmentSlot4", "AppointmentSlot5"];
        _0x8cd137.forEach(function (_0x546cf3) {
          var _0x483834 = $('.k-widget.k-dropdown.form-control[aria-owns=\'' + _0x546cf3 + '_listbox\']');
          if (_0x483834.is(":visible")) {
            _0x31629d = "AppointmentSlot" + _0x546cf3.slice(15);
          }
        });
        async function _0x28331b() {
          const _0x3f4ebc = await GM.getValue("code", 0);
          if (_0x3f4ebc) {
            clearInterval(_0x28331b);
            await GM.setValue("code", null);
            document.querySelector("#EmailVerificationCode").value = _0x3f4ebc;
            if (document.querySelector("#progress-percent").textContent == '0%' && $("#EmailVerificationCode").val() === _0x3f4ebc) {
              clearInterval(_0x28331b);
               $("#btnVerifyEmail").click();
            }
          }
        }
        setInterval(_0x28331b, 100);
      }