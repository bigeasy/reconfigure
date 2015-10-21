#!/bin/bash

discovery=$(curl -s https://discovery.etcd.io/new?size=$1)
echo $discovery

cat <<EOF
[Unit]
Description=etcd-reconfigure

[Service]
EnvironmentFile=/etc/environment
ExecStartPre=-/usr/bin/docker kill etcd-reconfigure
ExecStartPre=-/usr/bin/docker rm etcd-reconfigure
ExecStart=/usr/bin/docker run -v /usr/share/ca-certificates/:/etc/ssl/certs \
    -p 7002:7002 -p 4003:4003 --name etcd-reconfigure quay.io/coreos/etcd:v2.2.0 \
    -name etcd-reconfigure-${COREOS_PRIVATE_IPV4} \
    -initial-advertise-peer-urls http://${COREOS_PRIVATE_IPV4}:4003 \
    -listen-peer-urls http://0.0.0.0:4003 \
    -listen-client-urls http://0.0.0.0:7002 \
    -advertise-client-urls http://${COREOS_PRIVATE_IPV4}:7002 \
    -discovery $discovery
ExecStop=/usr/bin/docker stop etcd-reconfigure

[X-Fleet]
Global=true
EOF
