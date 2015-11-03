# Reconfigure

A reconfiguration service for CoreOS applications.

`bash etcd/etcd.sh` starts etcd locally.

`reconfigure serve --port=8080 --etcdaddr=$DOCKER_HOST:2379` starts an HTTP
server and Reconfigure.

`reconfigure register 127.0.0.1:8080 54.10.58.4:2333` registers
`54.10.58.4:2333` for updates. `reconfigure deregister` is similar.

`reconfigure set 127.0.0.1:8080 key value` sets an etcd `key` to `value`.

`reconfigure list 127.0.0.1:8080` lists current keys and values.
