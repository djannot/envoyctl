#!/usr/bin/env node
const yargs = require('yargs');
const concat = require('mississippi').concat;
const readFile = require('fs').readFile;
const table = require('cli-table3');

const argv = yargs
	.usage('node envoy.json [options]')
	.help('h')
	.alias('h', 'help')
	.demand('f')
	.nargs('f', 1)
	.describe('f', 'JSON file to parse')
	.boolean('t')
	.describe('t', 'Truncate output')
	.default('t', true)
	.nargs('r', 1)
	.describe('r', 'Only show entries for this route name')
	.nargs('d', 1)
	.describe('d', "Only show entries where at least a domain name matches this regular expressions.")
	.argv;

let table_data = new table({
	head: ['Dynamic listener', 'Route name', 'Domains', 'Match', 'Route', 'Per filter config', 'Cluster']
});

if (argv.t) {
	table_data = new table({
		head: ['Dynamic listener', 'Route name', 'Domains', 'Match', 'Route', 'Per filter config', 'Cluster'],
		colWidths: [20, 30, 50, 50, 50, 50, 50]
	});
}

let js = {};

const file = argv.f;
if (file === '-') {
        process.stdin.pipe(concat(parse));
} else {
        readFile(file, (err, dataBuffer) => {
                if (err) throw err;
                else parse(dataBuffer.toString());
        });
}

function array_match(arr, expr) {
	let found = false;
	let regexp = new RegExp(expr, 'gi');
	arr.forEach(item => {
		if(regexp.test(item)) {
			found = true;
		}
	});
	return found;
}

function parse(str) {
	let js = JSON.parse(str)

	let configs = {};
	js.configs.forEach(config => {
			configs[config['@type']] = config;
	});

	routes_by_dynamic_listeners = {};
	let listeners_config_dump = configs['type.googleapis.com/envoy.admin.v3.ListenersConfigDump'];
	listeners_config_dump.dynamic_listeners.forEach(dynamic_listener => {
		routes_by_dynamic_listeners[dynamic_listener.name] = [];
		if ('active_state' in dynamic_listener) {
			dynamic_listener.active_state.listener.filter_chains.forEach(filter_chain => {
				filter_chain.filters.forEach(filter => {
					if (filter.name == 'envoy.filters.network.http_connection_manager') {
                        if (filter.typed_config.rds) {
                            routes_by_dynamic_listeners[dynamic_listener.name].push(filter.typed_config.rds.route_config_name);
                        } else {
                            routes_by_dynamic_listeners[dynamic_listener.name].push(filter.typed_config.route_config.name);
                        }
                    }
				});
			});
		}
	});

	route_configs_by_route = {}
	let routes_config_dump = configs['type.googleapis.com/envoy.admin.v3.RoutesConfigDump'];
	routes_config_dump.dynamic_route_configs.forEach(dynamic_route_config => {
			route_configs_by_route[dynamic_route_config.route_config.name] = dynamic_route_config.route_config;
	});
	routes_config_dump.static_route_configs.forEach(static_route_config => {
        if (static_route_config.route_config.name) {
            route_configs_by_route[static_route_config.route_config.name] = static_route_config.route_config;
        }
    });

	endpoint_config_by_route = {};
	if('type.googleapis.com/envoy.admin.v3.EndpointsConfigDump' in configs) {
		let endpoints_config_dump = configs['type.googleapis.com/envoy.admin.v3.EndpointsConfigDump'];
		endpoints_config_dump.dynamic_endpoint_configs.forEach(dynamic_endpoint_config => {
			endpoint_config_by_route[dynamic_endpoint_config.endpoint_config.cluster_name.replace(/_\./g, "|")] = dynamic_endpoint_config.endpoint_config;
		});
	}

	Object.keys(routes_by_dynamic_listeners).forEach(dynamic_listener => {
		routes_by_dynamic_listeners[dynamic_listener].forEach(route => {
			route_configs_by_route[route].virtual_hosts.forEach(virtual_host => {
				if ((typeof argv.d === 'undefined') || (array_match(virtual_host.domains, argv.d))) {
					if (virtual_host.routes) {
						virtual_host.routes.forEach(r => {
							let route_to_display;
							if (r.route) route_to_display = r.route;
							if (r.direct_response) route_to_display = r.direct_response;
							let cluster_to_display;
							if (r.route && 'cluster' in r.route && r.route.cluster in endpoint_config_by_route) cluster_to_display = endpoint_config_by_route[r.route.cluster];
							let per_filter_config_to_display;
							if (r.typed_per_filter_config) per_filter_config_to_display = r.typed_per_filter_config;
							table_data.push([dynamic_listener, route, virtual_host.domains.join("\n"), JSON.stringify(r.match, null, 2), JSON.stringify(route_to_display, null, 2), JSON.stringify(per_filter_config_to_display, null, 2), JSON.stringify(cluster_to_display, null, 2)]);
						});
					}
				}
			});
		});
	});

	console.table(table_data.toString());
}
