package app;

import gateway.Gateway;
import gateway.SessionType;
import models.TrackRequest;

import java.util.List;

public abstract class BrokerMediatorAppGateway extends Gateway {
    public BrokerMediatorAppGateway() {
        super("trackRequestQueue", SessionType.Queue, "trackResponseQueue", SessionType.Queue);
    }

    public void sendMessage(TrackRequest track) {
        String json = this.gson.toJson(track);
        this.messageSender.send(json, "");
    }

    public void sendMessage(List<String> uris) {
        String json = this.gson.toJson(uris);
        this.messageSender.send(json, "4");
    }

    @Override
    public void receiveMessage(String trackJson, String correlationId) {
        // TrackRequest track = this.gson.fromJson(trackJson, TrackRequest.class);
        receiveTrackResponse(trackJson);
    }

    protected abstract void receiveTrackResponse(String trackJson);
}
