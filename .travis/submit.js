const https = require("https");

// Submit result to codestates database
const { LAMBDA_URL, LAMBDA_KEY, TRAVIS_PULL_REQUEST_SLUG } = process.env;

if (LAMBDA_KEY === "\n") {
  throw new Error("lambda key is missing");
}

if (TRAVIS_PULL_REQUEST_SLUG === "\n") {
  throw new Error("github username is missing");
}

const username = TRAVIS_PULL_REQUEST_SLUG.split('/')[0];
console.log(username);

const options = {
  hostname: LAMBDA_URL,
  path: "/feature/submition/create",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  }
};

console.log(JSON.stringify(options));

const req = https.request(options, res => {
  let data;

  res.on("data", chunk => {
    data += chunk;
  });

  res.on("end", () => {
    console.log('data from labmda is ', data);

    if (res.statusCode >= 400) {
      if (res.statusCode === 400) {
        throw new Error("invalid github username.");
      }
      throw new Error("There is an error on response from lambda.");
    }
  });
});

req.on("error", e => {
  console.log(e);
  throw new Error("data did not send to lambda");
});

// send the request
req.write(
  JSON.stringify(
    {
      title: "Twittler",
      githubUsername: username,
      lambdaKey: LAMBDA_KEY,
      passed: 0,
      failed: 0,
      assessmentId: 3
    }
  )
);
req.end();
