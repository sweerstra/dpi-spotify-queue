package app;

import gateway.Gateway;
import gateway.SessionType;
import models.TrackRequest;

public abstract class BrokerClientAppGateway extends Gateway {
    public BrokerClientAppGateway(String group) {
        super(group + ".suggestionResponseTopic", SessionType.Topic, group + ".suggestionRequestTopic", SessionType.Topic);
    }

    public void sendMessage(String tracksJson) {
        this.messageSender.send(tracksJson, "4");
    }

    @Override
    public void receiveMessage(String json, String correlationId) {
        TrackRequest track = this.gson.fromJson(json, TrackRequest.class);
        receiveSuggestionRequest(track);
    }

    protected abstract void receiveSuggestionRequest(TrackRequest track);
}
