package app;

import gateway.Gateway;
import gateway.SessionType;
import models.TrackRequest;

import java.util.List;

public abstract class BrokerMediatorAppGateway extends Gateway {
    public BrokerMediatorAppGateway(String group) {
        super("trackRequestQueue", SessionType.Queue, group + ".trackResponseTopic", SessionType.Topic);
    }

    public void sendMessage(TrackRequest track) {
        String json = this.gson.toJson(track);
        this.messageSender.send(json, "4");
    }

    public void sendMessage(List<String> uris, String correlation) {
        String json = this.gson.toJson(uris);
        this.messageSender.send(json, correlation);
    }

    @Override
    public void receiveMessage(String trackJson, String correlationId) {
        receiveTrackResponse(trackJson);
    }

    protected abstract void receiveTrackResponse(String trackJson);
}
