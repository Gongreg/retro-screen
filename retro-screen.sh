sudo rm /tmp/testas /tmp/forever.log /tmp/retro-screen.out /tmp/retro-screen.err;
sudo forever stopall;
sudo forever start --killSignal=SIGINT -l /tmp/forever.log -o /tmp/retro-screen.out -e /tmp/retro-screen.err /home/pi/projects/retro-screen/app.js
