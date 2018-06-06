package gateway;

import com.google.gson.Gson;
import org.apache.activemq.command.ActiveMQBytesMessage;

import javax.jms.BytesMessage;
import javax.jms.JMSException;
import javax.jms.Message;
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
            if (message instanceof BytesMessage) {
                try {
                    BytesMessage bytesMessage = (BytesMessage) message;
                    byte[] byteData;
                    byteData = new byte[(int) bytesMessage.getBodyLength()];
                    bytesMessage.readBytes(byteData);
                    bytesMessage.reset();
                    String text = new String(byteData);
                    receiveMessage(text, message.getJMSCorrelationID());
                } catch (JMSException e) {
                    e.printStackTrace();
                }
            } else if (message instanceof TextMessage) {
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

