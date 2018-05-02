import gateway.Gateway;
import gateway.SessionType;
import models.TrackRequest;

public class BrokerClientAppGateway extends Gateway {
    public BrokerClientAppGateway(String senderChannel, String receiverChannel) {
        super(senderChannel, SessionType.Queue, receiverChannel, SessionType.Topic);
    }

    @Override
    protected void receiveMessage(String json, String correlationId) {
        TrackRequest track = this.gson.fromJson(json, TrackRequest.class);

        System.out.println(json);
    }
}
