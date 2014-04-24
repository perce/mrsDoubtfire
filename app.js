var amqp = require( 'amqp' );

var connection = amqp.createConnection(
  {
    host     : 'localhost'
  }
);


// Wait for connection to become established.
connection.on( 'ready', function () {
  console.log( 'established connection' );

  // set up new exchange
  connection.exchange( 'immediate' );

  connection.queue(
    'clean.up.execution',
    {
      autoDelete: false,
      durable: true
    },
    function( q ) {
      q.bind( 'immediate', 'clean.up.execution', function() {
        console.log( 'subscribing' );

        q.subscribe( function( msg, headers, deliveryInfo ) {
          console.log( 'joooo' );
          console.log( msg );
          console.log( headers );
        } );
      } );
    }
  );

  // Use the default 'amq.topic' exchange
  connection.queue(
    'clean.up',
    {
      arguments:{
        'x-dead-letter-exchange' :'immediate',
        'x-message-ttl'          : 1000,
        'x-expires'              : 2000,
      }
    },
    function() {
      console.log( 'publishing message' );
      connection.publish(
        'clean.up',
        'jojo'
      );
    }
  );

  connection.on( 'close', function() {
    console.log( 'done.' );
  } );
} );
