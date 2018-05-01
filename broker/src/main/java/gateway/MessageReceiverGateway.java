package gateway;

import org.apache.activemq.ActiveMQConnectionFactory;

import javax.jms.*;

public class MessageReceiverGateway {
    private MessageConsumer consumer;
    private Destination destination;

    public MessageReceiverGateway(String channelName, SessionType sessionType) {
        try {
            ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory("tcp://localhost:61616");

            Connection connection = connectionFactory.createConnection();
            connection.start();

            Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);

            if (sessionType == SessionType.Queue) {
                destination = session.createQueue(channelName);
            } else if (sessionType == SessionType.Topic) {
                destination = session.createTopic(channelName);
            }

            consumer = session.createConsumer(destination);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void setListener(MessageListener listener) {
        try {
            consumer.setMessageListener(listener);
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
}
