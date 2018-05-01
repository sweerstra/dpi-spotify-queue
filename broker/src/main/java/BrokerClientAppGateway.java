import gateway.Gateway;
import gateway.SessionType;

public class BrokerClientAppGateway extends Gateway {
    public BrokerClientAppGateway(String senderChannel, String receiverChannel) {
        super(senderChannel, SessionType.Queue, receiverChannel, SessionType.Topic);
    }

    @Override
    protected void receiveMessage(String json, String correlationId) {
        System.out.println(json);
    }
}
