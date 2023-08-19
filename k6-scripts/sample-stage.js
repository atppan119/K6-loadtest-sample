import http from "k6/http";
import { check, sleep } from "k6";
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';


export let options = {
  stages: [
    // Ramp-up from 1 to 10 virtual users (VUs) in 10s
    { duration: "10s", target: 10 },

    // Stay at rest on 10 VUs for 30s
    { duration: "30s", target: 10 },

    // Ramp-down from 10 to 0 VUs for 10s
    { duration: "10s", target: 0 },
  ],
};

export default function () {
  let data = { email: randomString(10)+"@mail.com", password: "zL@12345678" , confirmpassword: "zL@12345678"}
  const response = http.post("http://35.240.229.194/atp-authen/register", JSON.stringify(data), {
    headers: { "Content-Type": "application/json" , 'x-api-key':"a667188"},
  });
  check(response, { "status is 200": (r) => r.status === 200 });
  sleep(0.5);
}