MOBILE STUDENT REGISTRATION APP

Files:
- index.html
- style.css
- app.js
- manifest.json
- sw.js
- icon-192.png
- icon-512.png

Run:
1. Open this folder in Visual Studio Code.
2. Install Live Server (Ritwick Dey) if needed.
3. Right-click index.html -> Open with Live Server.
4. Use F12 and Ctrl+Shift+M for phone view.

Test:
T1 Valid entry: ID 22001, any name, programme, Year 2.
T2 Duplicate ID: use ID 22001 again.
T3 Missing field: ID 22002, leave Full name empty.
T4 Year too high: ID 22003, Year 9.
T5 Spaces only: ID 22004, name is three spaces.
T6 Persistence: refresh with F5.
T7 Touch size: tap all controls in phone view.

PWA:
The manifest and service worker are included. Service workers require localhost
or HTTPS. Live Server can be used for local testing.

The PNG icons are included at the required 192x192 and 512x512 sizes.
