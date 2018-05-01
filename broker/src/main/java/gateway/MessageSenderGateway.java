package gateway;

import org.apache.activemq.ActiveMQConnectionFactory;

import javax.jms.*;

public class MessageSenderGateway {
    private Session session;
    private MessageProducer producer;
    private Destination destination;

    public MessageSenderGateway(String channelName, SessionType sessionType) {
        try {
            ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory("tcp://localhost:61616");

            Connection connection = connectionFactory.createConnection();
            connection.start();

            session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);

            if (sessionType == SessionType.Queue) {
                destination = session.createQueue(channelName);
            } else if (sessionType == SessionType.Topic) {
                destination = session.createTopic(channelName);
            }

            producer = session.createProducer(destination);
            producer.setDeliveryMode(DeliveryMode.NON_PERSISTENT);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void send(String json, String correlationId) {
        try {
            Message message = session.createTextMessage(json);
            message.setJMSCorrelationID(correlationId);

            producer.send(message);
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
}
