FROM node:10

RUN wget https://github.com/griddb/c_client/releases/download/v4.3.0/griddb-c-client_4.3.0_amd64.deb
RUN dpkg -i griddb-c-client_4.3.0_amd64.deb

WORKDIR /opt/nodejs
COPY package*.json ./
RUN npm install --quiet

ENV LD_LIBRARY_PATH /usr/griddb_c_client-4.3.0/lib/
