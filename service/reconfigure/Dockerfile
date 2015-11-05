FROM shift/coreos-ubuntu-etcd

RUN curl --silent --location https://deb.nodesource.com/setup_0.12 | sudo bash -
RUN sudo apt-get install --yes nodejs

COPY . /home/
RUN cd /home; npm install

EXPOSE 4077
CMD ["node", "/home/reconfigure.bin.js", "serve", "--port=4077", "--etcdaddr=127.0.0.1:2379"]
