<a href="#">
    <img src="https://i.postimg.cc/Bv6Cnp9z/group.png" alt="Weather app logo" align="right" height="60" />
</a>

# Hangout

Hangout is web app that allows you to communicate with other persons, either thorough a direct message chat or by using an audio video channel, leveraging peer to peer connection. It also supports messages with media conent, markdown and code.

<a href="https://www.youtube.com/watch?v=HNb0TTiL960">Hangout Demo</a>

<p align="center">
  <img src="https://i.postimg.cc/Y0rTqW3C/image-mare.png" alt="Photo of the presentation of the project"/>
  <img src="https://i.postimg.cc/xTFBnqb9/imageaudiovideo.png" alt="Photo of the presentation of the project"/>
</p>

## Features

- Login and register using AWS Cognito
- Change user name and photo
- Add/Remove friends
- Chat with friends by using:
    - Plain text
    - Media files
    - Code snipets
- Create chat rooms
- Manage chat rooms
- Comunicate with other users through an audio video channel
    - Connection is done peer to peer by using WebRTC protocol

## Technologies

- Express
- Web Sockets
- WebRTC
- TypeScript
- Prisma
- AWS SDKs: Cognito, S3
- Molter

## Build process

- `npm install` (to install dependencies)
- `npm run dev` (to run the app)
- `npm run build` (for production)
- `npm run buildw` (build code to JavaScript from TypeScript on code change)
