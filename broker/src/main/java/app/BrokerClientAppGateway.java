package app;

import gateway.Gateway;
import gateway.SessionType;
import models.TrackRequest;

public abstract class BrokerClientAppGateway extends Gateway {
    public BrokerClientAppGateway() {
        super("suggestionResponseQueue", SessionType.Queue, "suggestionRequestTopic", SessionType.Topic);
    }

    public void sendMessage(TrackRequest track) {
        String json = this.gson.toJson(track);
        this.messageSender.send(json, "");
    }

    @Override
    public void receiveMessage(String json, String correlationId) {
        TrackRequest track = this.gson.fromJson(json, TrackRequest.class);
        receiveSuggestionRequest(track);
    }

    protected abstract void receiveSuggestionRequest(TrackRequest track);
}
