# theremin

A basic theremin built during a hack day at @doberman. The theremin can be controlled using:

- The Fuffr JS SDK
- Leap Motion, thanks to @larsericsson
 
## Setup

Make sure you have [npm](https://www.npmjs.org/) and [Bower](http://bower.io/) installed. Then:

    npm install
    bower install

Start your web server:

    grunt serve --allow-remote

If you're using Fuffr as a controller, point the FuffrBox app to your web server.

## Controls

### Fuffr

Volume – up/down on left hand side of the iPhone
Tone frequency – up/down on right hand side of the iPhone

### Leap Motion

X/Y axis to control frequency and volume.
