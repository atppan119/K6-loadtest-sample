import http from "k6/http";
import { check, sleep } from "k6";
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';


export const options = {
  scenarios: {
    // register sccenario
    register: {
      exec: "register_scenario",
      executor: 'constant-vus',
      vus: 20,
      duration: '60s',
    },
    // register sccenario
    login: {
      exec: "login_scenario",
      executor: 'constant-vus',
      startTime: '60s',
      vus: 20,
      duration: '60s',
    }
  },
}

export function register_scenario() {
  let reg_data = { email: randomString(10)+"@testmail.com", password: "zL@12345678" , confirmpassword: "zL@12345678"};
  const reg_res = http.post("http://35.240.229.194/atp-authen/register", JSON.stringify(reg_data), {
    headers: { "Content-Type": "application/json" , 'x-api-key':"a667188"},
  });
  check(reg_res, { "register status is 200": (r) => r.status === 200 });
  sleep(0.5);
}

export function login_scenario() {
  let email = "atpk6"+randomIntBetween(1,4000)+"@testk6.com"
  //signin
  let signin_data = { email: email, password: "zL@12345678"};
  const signin_res = http.post("http://35.240.229.194/atp-authen/signin", JSON.stringify(signin_data), {
    headers: { "Content-Type": "application/json" , 'x-api-key':"a667188"},
  });
  check(signin_res, { "signin status is 200": (r) => r.status === 200 });

  //generate otp
  let genotp_data = { email: email};
  const genotp_res = http.post("http://35.240.229.194/atp-authen/generate-otp", JSON.stringify(genotp_data), {
    headers: { "Content-Type": "application/json" , 'x-api-key':"a667188" , 'otp-session-token':JSON.parse(signin_res.body).data.tokenSessionOTP},
  });
  check(genotp_res, { "genotp status is 200": (r) => r.status === 200 });

  //verify otp
  let verify_data = { email: email, otpRef: JSON.parse(genotp_res.body).data.ref, otpVal: JSON.parse(genotp_res.body).data.val};
  const verify_res = http.post("http://35.240.229.194/atp-authen/verify", JSON.stringify(verify_data), {
    headers: { "Content-Type": "application/json" , 'x-api-key':"a667188"},
  });
  check(verify_res, { "verify status is 200": (r) => r.status === 200 });
  sleep(0.5);
}
