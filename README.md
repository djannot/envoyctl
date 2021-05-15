# envoyctl

A CLI tool to help debugging Envoy

## Dependencies

You simply need to have [Node.js](https://nodejs.org) installed

## Installation

```
git clone https://github.com/djannot/envoyctl.git
cd envoyctl
npm install
```

You can then run `node envoyctl.js`.

But you can also run `npm link` to make it available through `envoyctl`.

## Usage

You can run `envoyctl -h` to display the help.

But the basic usage is either:

```
envoyctl -f <Envoy config dump file>
```

or

```
cat <Envoy config dump file> | envoyctl -f -
```

It has been tested with both Gloo Edge and Istio.

For example, to see the configuratin of the Istio ingress gateway:

```
kubectl -n istio-system port-forward deploy/istio-ingressgateway 15000 &
PID=$!
sleep 3
curl localhost:15000/config_dump | envoyctl -f -
kill $PID
```

or with `istioctl` (>= 1.10):

```
istioctl pc all deploy/istio-ingressgateway.istio-system -o json | envoyctl -f -
```

Here is an example of the output you can get:

```
┌────────────────────┬──────────────────────────────┬──────────────────────────────────────────────────┬──────────────────────────────────────────────────┬──────────────────────────────────────────────────┬──────────────────────────────────────────────────┬──────────────────────────────────────────────────┐
│ Dynamic listener   │ Route name                   │ Domains                                          │ Match                                            │ Route                                            │ Per filter config                                │ Cluster                                          │
├────────────────────┼──────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┤
│ 0.0.0.0_8080       │ http.80                      │ *                                                │ {                                                │ {                                                │                                                  │                                                  │
│                    │                              │                                                  │   "path": "/productpage",                        │   "cluster": "outbound|9080||productpage.defaul… │                                                  │                                                  │
│                    │                              │                                                  │   "case_sensitive": true                         │   "timeout": "0s",                               │                                                  │                                                  │
│                    │                              │                                                  │ }                                                │   "retry_policy": {                              │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "retry_on": "connect-failure,refused-stream… │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "num_retries": 2,                            │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "retry_host_predicate": [                    │                                                  │                                                  │
│                    │                              │                                                  │                                                  │       {                                          │                                                  │                                                  │
│                    │                              │                                                  │                                                  │         "name": "envoy.retry_host_predicates.pr… │                                                  │                                                  │
│                    │                              │                                                  │                                                  │       }                                          │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     ],                                           │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "host_selection_retry_max_attempts": "5",    │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "retriable_status_codes": [                  │                                                  │                                                  │
│                    │                              │                                                  │                                                  │       503                                        │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     ]                                            │                                                  │                                                  │
│                    │                              │                                                  │                                                  │   },                                             │                                                  │                                                  │
│                    │                              │                                                  │                                                  │   "max_stream_duration": {                       │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "max_stream_duration": "0s"                  │                                                  │                                                  │
│                    │                              │                                                  │                                                  │   }                                              │                                                  │                                                  │
│                    │                              │                                                  │                                                  │ }                                                │                                                  │                                                  │
├────────────────────┼──────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┤
│ 0.0.0.0_8080       │ http.80                      │ *                                                │ {                                                │ {                                                │                                                  │                                                  │
│                    │                              │                                                  │   "prefix": "/static",                           │   "cluster": "outbound|9080||productpage.defaul… │                                                  │                                                  │
│                    │                              │                                                  │   "case_sensitive": true                         │   "timeout": "0s",                               │                                                  │                                                  │
│                    │                              │                                                  │ }                                                │   "retry_policy": {                              │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "retry_on": "connect-failure,refused-stream… │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "num_retries": 2,                            │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "retry_host_predicate": [                    │                                                  │                                                  │
│                    │                              │                                                  │                                                  │       {                                          │                                                  │                                                  │
│                    │                              │                                                  │                                                  │         "name": "envoy.retry_host_predicates.pr… │                                                  │                                                  │
│                    │                              │                                                  │                                                  │       }                                          │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     ],                                           │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "host_selection_retry_max_attempts": "5",    │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "retriable_status_codes": [                  │                                                  │                                                  │
│                    │                              │                                                  │                                                  │       503                                        │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     ]                                            │                                                  │                                                  │
│                    │                              │                                                  │                                                  │   },                                             │                                                  │                                                  │
│                    │                              │                                                  │                                                  │   "max_stream_duration": {                       │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "max_stream_duration": "0s"                  │                                                  │                                                  │
│                    │                              │                                                  │                                                  │   }                                              │                                                  │                                                  │
│                    │                              │                                                  │                                                  │ }                                                │                                                  │                                                  │
├────────────────────┼──────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┤
│ 0.0.0.0_8080       │ http.80                      │ *                                                │ {                                                │ {                                                │                                                  │                                                  │
│                    │                              │                                                  │   "path": "/login",                              │   "cluster": "outbound|9080||productpage.defaul… │                                                  │                                                  │
│                    │                              │                                                  │   "case_sensitive": true                         │   "timeout": "0s",                               │                                                  │                                                  │
│                    │                              │                                                  │ }                                                │   "retry_policy": {                              │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "retry_on": "connect-failure,refused-stream… │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "num_retries": 2,                            │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "retry_host_predicate": [                    │                                                  │                                                  │
│                    │                              │                                                  │                                                  │       {                                          │                                                  │                                                  │
│                    │                              │                                                  │                                                  │         "name": "envoy.retry_host_predicates.pr… │                                                  │                                                  │
│                    │                              │                                                  │                                                  │       }                                          │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     ],                                           │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "host_selection_retry_max_attempts": "5",    │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "retriable_status_codes": [                  │                                                  │                                                  │
│                    │                              │                                                  │                                                  │       503                                        │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     ]                                            │                                                  │                                                  │
│                    │                              │                                                  │                                                  │   },                                             │                                                  │                                                  │
│                    │                              │                                                  │                                                  │   "max_stream_duration": {                       │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "max_stream_duration": "0s"                  │                                                  │                                                  │
│                    │                              │                                                  │                                                  │   }                                              │                                                  │                                                  │
│                    │                              │                                                  │                                                  │ }                                                │                                                  │                                                  │
├────────────────────┼──────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┤
│ 0.0.0.0_8080       │ http.80                      │ *                                                │ {                                                │ {                                                │                                                  │                                                  │
│                    │                              │                                                  │   "path": "/logout",                             │   "cluster": "outbound|9080||productpage.defaul… │                                                  │                                                  │
│                    │                              │                                                  │   "case_sensitive": true                         │   "timeout": "0s",                               │                                                  │                                                  │
│                    │                              │                                                  │ }                                                │   "retry_policy": {                              │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "retry_on": "connect-failure,refused-stream… │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "num_retries": 2,                            │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "retry_host_predicate": [                    │                                                  │                                                  │
│                    │                              │                                                  │                                                  │       {                                          │                                                  │                                                  │
│                    │                              │                                                  │                                                  │         "name": "envoy.retry_host_predicates.pr… │                                                  │                                                  │
│                    │                              │                                                  │                                                  │       }                                          │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     ],                                           │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "host_selection_retry_max_attempts": "5",    │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "retriable_status_codes": [                  │                                                  │                                                  │
│                    │                              │                                                  │                                                  │       503                                        │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     ]                                            │                                                  │                                                  │
│                    │                              │                                                  │                                                  │   },                                             │                                                  │                                                  │
│                    │                              │                                                  │                                                  │   "max_stream_duration": {                       │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "max_stream_duration": "0s"                  │                                                  │                                                  │
│                    │                              │                                                  │                                                  │   }                                              │                                                  │                                                  │
│                    │                              │                                                  │                                                  │ }                                                │                                                  │                                                  │
├────────────────────┼──────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┤
│ 0.0.0.0_8080       │ http.80                      │ *                                                │ {                                                │ {                                                │                                                  │                                                  │
│                    │                              │                                                  │   "prefix": "/api/v1/products",                  │   "cluster": "outbound|9080||productpage.defaul… │                                                  │                                                  │
│                    │                              │                                                  │   "case_sensitive": true                         │   "timeout": "0s",                               │                                                  │                                                  │
│                    │                              │                                                  │ }                                                │   "retry_policy": {                              │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "retry_on": "connect-failure,refused-stream… │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "num_retries": 2,                            │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "retry_host_predicate": [                    │                                                  │                                                  │
│                    │                              │                                                  │                                                  │       {                                          │                                                  │                                                  │
│                    │                              │                                                  │                                                  │         "name": "envoy.retry_host_predicates.pr… │                                                  │                                                  │
│                    │                              │                                                  │                                                  │       }                                          │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     ],                                           │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "host_selection_retry_max_attempts": "5",    │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "retriable_status_codes": [                  │                                                  │                                                  │
│                    │                              │                                                  │                                                  │       503                                        │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     ]                                            │                                                  │                                                  │
│                    │                              │                                                  │                                                  │   },                                             │                                                  │                                                  │
│                    │                              │                                                  │                                                  │   "max_stream_duration": {                       │                                                  │                                                  │
│                    │                              │                                                  │                                                  │     "max_stream_duration": "0s"                  │                                                  │                                                  │
│                    │                              │                                                  │                                                  │   }                                              │                                                  │                                                  │
│                    │                              │                                                  │                                                  │ }                                                │                                                  │                                                  │
└────────────────────┴──────────────────────────────┴──────────────────────────────────────────────────┴──────────────────────────────────────────────────┴──────────────────────────────────────────────────┴──────────────────────────────────────────────────┴──────────────────────────────────────────────────┘
```

Using `glooctl`:

```
glooctl proxy dump | envoyctl -f -
```

You can also get cluster details displayed if you include eds in the dump:

```
kubectl -n istio-system port-forward deploy/istio-ingressgateway 15000 &
PID=$!
sleep 3
curl localhost:15000/config_dump?include_eds | envoyctl -f -
kill $PID
```

## Online version

There's also a web version available at [https://envoyui.solo.io](https://envoyui.solo.io)

![envoyui](envoyui.png)