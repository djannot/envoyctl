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
