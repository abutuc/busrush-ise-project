# How to Run

## Install Node.js
<pre>
  sudo apt-get install curl
  curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - &&\
  sudo apt-get install nodejs
  node -v 
</pre>
  
## Install git
<pre>
  sudo apt-get update
  sudo apt-get install git-all
  git version
</pre>

## Install watchman
<pre>
  cd ~
  git clone https://github.com/facebook/watchman.git -b v4.9.0 --depth 1
  cd watchman
  sudo apt-get install -y autoconf automake build-essential python2-dev
  ./autogen.sh 
  ./configure --enable-lenient 
  make
  sudo make install
  watchman --version
</pre>

## Running the server
<pre>
  npm install
  npm start
</pre>
