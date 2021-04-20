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
kubect-n istio-system port-forward deploy/istio-ingressgateway 15000 &
curl localhost:15000/config_dump | envoyctl -f -
```

Here is an example of the output you can get:

```
┌──────────────────┬────────────┬─────────┬─────────────────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Dynamic listener │ Route name │ Domains │ Match                           │ Route                                                                                          │
├──────────────────┼────────────┼─────────┼─────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 0.0.0.0_8080     │ http.80    │ *       │ {                               │ {                                                                                              │
│                  │            │         │   "path": "/productpage",       │   "cluster": "outbound|9080||productpage.default.svc.cluster.local",                           │
│                  │            │         │   "case_sensitive": true        │   "timeout": "0s",                                                                             │
│                  │            │         │ }                               │   "retry_policy": {                                                                            │
│                  │            │         │                                 │     "retry_on": "connect-failure,refused-stream,unavailable,cancelled,retriable-status-codes", │
│                  │            │         │                                 │     "num_retries": 2,                                                                          │
│                  │            │         │                                 │     "retry_host_predicate": [                                                                  │
│                  │            │         │                                 │       {                                                                                        │
│                  │            │         │                                 │         "name": "envoy.retry_host_predicates.previous_hosts"                                   │
│                  │            │         │                                 │       }                                                                                        │
│                  │            │         │                                 │     ],                                                                                         │
│                  │            │         │                                 │     "host_selection_retry_max_attempts": "5",                                                  │
│                  │            │         │                                 │     "retriable_status_codes": [                                                                │
│                  │            │         │                                 │       503                                                                                      │
│                  │            │         │                                 │     ]                                                                                          │
│                  │            │         │                                 │   },                                                                                           │
│                  │            │         │                                 │   "max_stream_duration": {                                                                     │
│                  │            │         │                                 │     "max_stream_duration": "0s"                                                                │
│                  │            │         │                                 │   }                                                                                            │
│                  │            │         │                                 │ }                                                                                              │
├──────────────────┼────────────┼─────────┼─────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 0.0.0.0_8080     │ http.80    │ *       │ {                               │ {                                                                                              │
│                  │            │         │   "prefix": "/static",          │   "cluster": "outbound|9080||productpage.default.svc.cluster.local",                           │
│                  │            │         │   "case_sensitive": true        │   "timeout": "0s",                                                                             │
│                  │            │         │ }                               │   "retry_policy": {                                                                            │
│                  │            │         │                                 │     "retry_on": "connect-failure,refused-stream,unavailable,cancelled,retriable-status-codes", │
│                  │            │         │                                 │     "num_retries": 2,                                                                          │
│                  │            │         │                                 │     "retry_host_predicate": [                                                                  │
│                  │            │         │                                 │       {                                                                                        │
│                  │            │         │                                 │         "name": "envoy.retry_host_predicates.previous_hosts"                                   │
│                  │            │         │                                 │       }                                                                                        │
│                  │            │         │                                 │     ],                                                                                         │
│                  │            │         │                                 │     "host_selection_retry_max_attempts": "5",                                                  │
│                  │            │         │                                 │     "retriable_status_codes": [                                                                │
│                  │            │         │                                 │       503                                                                                      │
│                  │            │         │                                 │     ]                                                                                          │
│                  │            │         │                                 │   },                                                                                           │
│                  │            │         │                                 │   "max_stream_duration": {                                                                     │
│                  │            │         │                                 │     "max_stream_duration": "0s"                                                                │
│                  │            │         │                                 │   }                                                                                            │
│                  │            │         │                                 │ }                                                                                              │
├──────────────────┼────────────┼─────────┼─────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 0.0.0.0_8080     │ http.80    │ *       │ {                               │ {                                                                                              │
│                  │            │         │   "path": "/login",             │   "cluster": "outbound|9080||productpage.default.svc.cluster.local",                           │
│                  │            │         │   "case_sensitive": true        │   "timeout": "0s",                                                                             │
│                  │            │         │ }                               │   "retry_policy": {                                                                            │
│                  │            │         │                                 │     "retry_on": "connect-failure,refused-stream,unavailable,cancelled,retriable-status-codes", │
│                  │            │         │                                 │     "num_retries": 2,                                                                          │
│                  │            │         │                                 │     "retry_host_predicate": [                                                                  │
│                  │            │         │                                 │       {                                                                                        │
│                  │            │         │                                 │         "name": "envoy.retry_host_predicates.previous_hosts"                                   │
│                  │            │         │                                 │       }                                                                                        │
│                  │            │         │                                 │     ],                                                                                         │
│                  │            │         │                                 │     "host_selection_retry_max_attempts": "5",                                                  │
│                  │            │         │                                 │     "retriable_status_codes": [                                                                │
│                  │            │         │                                 │       503                                                                                      │
│                  │            │         │                                 │     ]                                                                                          │
│                  │            │         │                                 │   },                                                                                           │
│                  │            │         │                                 │   "max_stream_duration": {                                                                     │
│                  │            │         │                                 │     "max_stream_duration": "0s"                                                                │
│                  │            │         │                                 │   }                                                                                            │
│                  │            │         │                                 │ }                                                                                              │
├──────────────────┼────────────┼─────────┼─────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 0.0.0.0_8080     │ http.80    │ *       │ {                               │ {                                                                                              │
│                  │            │         │   "path": "/logout",            │   "cluster": "outbound|9080||productpage.default.svc.cluster.local",                           │
│                  │            │         │   "case_sensitive": true        │   "timeout": "0s",                                                                             │
│                  │            │         │ }                               │   "retry_policy": {                                                                            │
│                  │            │         │                                 │     "retry_on": "connect-failure,refused-stream,unavailable,cancelled,retriable-status-codes", │
│                  │            │         │                                 │     "num_retries": 2,                                                                          │
│                  │            │         │                                 │     "retry_host_predicate": [                                                                  │
│                  │            │         │                                 │       {                                                                                        │
│                  │            │         │                                 │         "name": "envoy.retry_host_predicates.previous_hosts"                                   │
│                  │            │         │                                 │       }                                                                                        │
│                  │            │         │                                 │     ],                                                                                         │
│                  │            │         │                                 │     "host_selection_retry_max_attempts": "5",                                                  │
│                  │            │         │                                 │     "retriable_status_codes": [                                                                │
│                  │            │         │                                 │       503                                                                                      │
│                  │            │         │                                 │     ]                                                                                          │
│                  │            │         │                                 │   },                                                                                           │
│                  │            │         │                                 │   "max_stream_duration": {                                                                     │
│                  │            │         │                                 │     "max_stream_duration": "0s"                                                                │
│                  │            │         │                                 │   }                                                                                            │
│                  │            │         │                                 │ }                                                                                              │
├──────────────────┼────────────┼─────────┼─────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 0.0.0.0_8080     │ http.80    │ *       │ {                               │ {                                                                                              │
│                  │            │         │   "prefix": "/api/v1/products", │   "cluster": "outbound|9080||productpage.default.svc.cluster.local",                           │
│                  │            │         │   "case_sensitive": true        │   "timeout": "0s",                                                                             │
│                  │            │         │ }                               │   "retry_policy": {                                                                            │
│                  │            │         │                                 │     "retry_on": "connect-failure,refused-stream,unavailable,cancelled,retriable-status-codes", │
│                  │            │         │                                 │     "num_retries": 2,                                                                          │
│                  │            │         │                                 │     "retry_host_predicate": [                                                                  │
│                  │            │         │                                 │       {                                                                                        │
│                  │            │         │                                 │         "name": "envoy.retry_host_predicates.previous_hosts"                                   │
│                  │            │         │                                 │       }                                                                                        │
│                  │            │         │                                 │     ],                                                                                         │
│                  │            │         │                                 │     "host_selection_retry_max_attempts": "5",                                                  │
│                  │            │         │                                 │     "retriable_status_codes": [                                                                │
│                  │            │         │                                 │       503                                                                                      │
│                  │            │         │                                 │     ]                                                                                          │
│                  │            │         │                                 │   },                                                                                           │
│                  │            │         │                                 │   "max_stream_duration": {                                                                     │
│                  │            │         │                                 │     "max_stream_duration": "0s"                                                                │
│                  │            │         │                                 │   }                                                                                            │
│                  │            │         │                                 │ }                                                                                              │
└──────────────────┴────────────┴─────────┴─────────────────────────────────┴────────────────────────────────────────────────────────────────────────────────────────────────┘
```
