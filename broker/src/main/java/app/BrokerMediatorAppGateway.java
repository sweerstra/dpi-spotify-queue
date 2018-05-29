package app;

import gateway.Gateway;
import gateway.SessionType;
import models.TrackRequest;

public abstract class BrokerMediatorAppGateway extends Gateway {
    public BrokerMediatorAppGateway() {
        super("trackRequestQueue", SessionType.Queue, "trackResponseQueue", SessionType.Queue);
    }

    public void sendMessage(TrackRequest track) {
        String json = this.gson.toJson(track);
        this.messageSender.send(json, "");
    }

    @Override
    public void receiveMessage(String trackJson, String correlationId) {
        // TrackRequest track = this.gson.fromJson(json, TrackRequest.class);
        receiveTrackResponse(trackJson);
    }

    protected abstract void receiveTrackResponse(String track);
}
