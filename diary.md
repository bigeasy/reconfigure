Created new mount instead of `default.etcd`.
if we don't, and are using a cluster later, will lose leader/member
configurations between stops/starts.

I should just document decisions here.

Moved etcd arguments to Kubernetes yaml since Docker doesn't handle them
properly. means we can use quay instead of shift, no need for etcd Dockerfile
take note of Alan's process:
    #command: ["bash", "-c", "sudo apt-get -y install curl  && {  while ! curl -L 'http://127.0.0.1:4001/version'; do sleep 1; done; node /home/reconfigure.bin.js serve --port=4077; }" ]
