import Paho from 'paho-mqtt';
class Mqtt {
    reconnectTimeout = 2;

    //alwaysConnect(client, topicWeb, user, pass, pageState) {
    alwaysConnect(client, topicWeb, user, pass) {
      console.log(topicWeb, user, pass);
        client.connect({
            onSuccess: () => {
                console.log('MQTT Connected....');
                client.subscribe(topicWeb);
                //pageState.mqttConnected = true;
            },
            //onFailure: () => setTimeout(() => this.alwaysConnect(client, topicWeb, user, pass, pageState), this.reconnectTimeout * 1000),
            onFailure: () => console.log('failed to connect'),
            timeout: this.reconnectTimeout,
            //useSSL: true,
            userName: user,
            password: pass,
        });
    }
}
const mqtt = new Mqtt();
const startMQTT = (options) => {
    if (!(options && options.host && options.user)) return;

    const host = options.host.replace(/\w+:\/\//, '');
    const port = parseInt(options.portWeb);
    const { topicWeb, user, pass } = options;

    try {
    // clientId must be unique for each connection to the mqtt server
    // duplicate clientId connections could disconnect other clients
        const clientId = `WebClient${new Date().toString().replace(/\s/, '-')}`;
      console.log(host,port,clientId,'----');
        const client = new Paho.Client(host, port, clientId);
        client.onConnectionLost = (response) => {
            console.log(
                `MQTT Lost Connection: ${
                    response.errorCode !== 0
                        ? `${response.errorMessage} code: ${response.errorCode}`
                        : 'Unknown MQTT Error'}`,
            );
        };
        client.onMessageArrived = (message) => {
            const content = JSON.parse(message.payloadString);
            console.log(content);
        };
        //mqtt.alwaysConnect(client, topicWeb, user, pass, this.pageState);
        mqtt.alwaysConnect(client, topicWeb, user, pass);
    } catch (e) {
        console.log(e);
    }
};

function App() {


  startMQTT({
    //host:'139.177.197.122',
    // or
    host:'wss://139.177.197.122', // the wss:// will be trimmed from string later
    user:'anzen',
    pass:'helloworld',
    portWeb:'9001',
    topicWeb:'blah1'
  });

  return (
    <div className="App">
    </div>
  );
}

export default App;
