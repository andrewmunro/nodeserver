var io = require('socket.io-client');
var assert = require('assert');
var expect = require('expect.js');

describe('Server Tests', function() {

    var socket;

    beforeEach(function(done) {
        // Setup
        socket = io.connect('http://localhost:8001', {
            'reconnection delay' : 0
            , 'reopen delay' : 0
            , 'force new connection' : true
        });
        socket.on('connect', function() {
            console.log('worked...');
            done();
        });
        socket.on('disconnect', function() {
            console.log('disconnected...');
        })
    });

    afterEach(function(done) {
        // Cleanup
        if(socket.socket.connected) {
            console.log('disconnecting...');
            socket.disconnect();
        } else {
            // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
            console.log('no connection to break...');
        }
        done();
    });

    describe('Testing:', function() {


        it('Test', function(done) {
            console.log("test");
        });

        it('Creating a player', function(done) {
            socket.emit('playerNew', {
                x:0,
                y:0,
                z:0,
                r:0
            });
            done();
        });
    });

});