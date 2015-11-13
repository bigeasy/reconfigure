# Reconfigure

A reconfiguration service for CoreOS applications.

`bash etcd/etcd.sh` starts etcd locally.

`reconfigure serve --port=8080 --etcdaddr=172.your.IP.10:2379` starts an HTTP
server and Reconfigure.

`reconfigure register 127.0.0.1:8080 http://54.10.58.4:2333/some-endpoint` registers
the url `http://54.10.58.4:2333/some-endpoint` for updates. `reconfigure deregister`
is similar. `reconfigure registered` returns registered endpoints.

`reconfigure set 127.0.0.1:8080 key value` sets an etcd `key` to `value`.

`reconfigure list 127.0.0.1:8080` lists current keys and values.
