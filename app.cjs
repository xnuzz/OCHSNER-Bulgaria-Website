// Startup file for cPanel "Setup Node.js App": Passenger loads it with require(),
// which cannot load the ES-module server.js, so hand off through import().
import('./server.js')
