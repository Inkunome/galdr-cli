export class Index {
    constructor(private path: string) { }
} 


import EventStoreClient, { Event, ISubscriptionConfirmation, ISubscriptionDropped, NotHandledReason, ISubscriptionNotHandled } from "event-store-client";

// Sample application to demonstrate how to use the Event Store Client
/*************************************************************************************************/
// CONFIGURATION
var config = {
    'eventStore': {
    	'address': "127.0.0.1",
        'port': 1113,
        'stream': '$stats-127.0.0.1:2113',
        'credentials': {
			'username': "admin",
			'password': "changeit"
        }
    },
    'debug': false
};
/*************************************************************************************************/

// Connect to the Event Store
var options = {
	host: config.eventStore.address,
	port: config.eventStore.port,
    debug: config.debug
};
console.log('Connecting to ' + options.host + ':' + options.port + '...');
var connection = new EventStoreClient.Connection(options);
console.log('Connected');

// Ping it to see that its there
connection.sendPing(() => {});

// Subscribe to receive statistics events
var streamId = config.eventStore.stream;
var credentials = config.eventStore.credentials;

var written = false;
var read = false;
var readMissing = false;

console.log('Subscribing to ' + streamId + "...");
var correlationId = connection.subscribeToStream("Hey", true, 
  (ev: Event) => { 
    console.log("Event is coming!");
    
    console.log(ev.eventType);
    console.log(ev.data);
  }, 
  (confirmation: ISubscriptionConfirmation) => { console.log("confirmate"); },
  (dropped: ISubscriptionDropped) => { console.log("Dropped"); },
  credentials,
  (nothandled: ISubscriptionNotHandled) => { console.log("Not handled"); });
