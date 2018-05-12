package app;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class BrokerApplication extends Application {
    public static void main(final String[] arguments) {
        launch(arguments);
    }

    @Override
    public void start(final Stage stage) throws Exception {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/Broker.fxml"));
        Parent root = loader.load();

        //Now we have access to getController() through the instance... don't forget the type cast
        BrokerController controller = loader.getController();

        Scene scene = new Scene(root);

        stage.setScene(scene);
        stage.show();
    }
}