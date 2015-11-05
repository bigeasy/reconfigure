Created new mount instead of `default.etcd`.
if we don't, and are using a cluster later, will lose leader/member
configurations between stops/starts.

I should just document decisions here.

Moved etcd arguments to Kubernetes yaml since Docker doesn't handle them
properly. means we can use quay instead of shift, no need for etcd Dockerfile
