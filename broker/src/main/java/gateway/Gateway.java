package gateway;

import com.google.gson.Gson;

import javax.jms.JMSException;
import javax.jms.TextMessage;

public abstract class Gateway {
    protected MessageSenderGateway messageSender;
    protected MessageReceiverGateway messageReceiver;
    protected Gson gson;

    public Gateway(String senderChannel, SessionType senderSessionType, String receiverChannel, SessionType receiverSessionType) {
        messageSender = new MessageSenderGateway(senderChannel, senderSessionType);
        messageReceiver = new MessageReceiverGateway(receiverChannel, receiverSessionType);
        gson = new Gson();

        messageReceiver.setListener(message -> {
            if (message instanceof TextMessage) {
                try {
                    receiveMessage(((TextMessage) message).getText(), message.getJMSCorrelationID());
                } catch (JMSException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    protected abstract void receiveMessage(String json, String correlationId);
}

