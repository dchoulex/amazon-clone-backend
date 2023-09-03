![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)

Technology used: Node.js, Express, MongoDB, Mongoose, JWT, Heroku.

<h1 align="center"> Amazon Clone Backend </h1>

This repository represents backend side of my amazon clone project. You can read API documentation from the link below.

https://documenter.getpostman.com/view/18687061/2s7YmxgitW

## ER Diagram

<img src="./readme_assets/er-diagram.svg" width="100%">

## Other Features

All API features are written in the documentation link above. This section will explain security feature that are not written in API documentation.

### Security

- Route protection for APIs that need authorization.
- Hashing and salting password.
- Create token using JWT.

### Cyber Security

- Set secure request headers.
- Sanitize input from user to prevent XSS.
- Sanitize data using mongoSanitize.
- Prevent HPP.
