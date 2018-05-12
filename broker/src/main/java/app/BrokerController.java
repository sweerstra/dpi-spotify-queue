package app;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.Initializable;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;
import models.TrackRequest;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;

public class BrokerController extends BrokerClientAppGateway implements Initializable {
    public TableView<TrackRequest> tvTracks;
    public TableColumn<TrackRequest, String> tcName;
    public TableColumn<TrackRequest, String> tcArtists;
    public TableColumn<TrackRequest, Integer> tcDuration;

    private ObservableList<TrackRequest> trackRequests;
    private List<TrackRequest> tracks;

    public BrokerController() {
        tracks = new ArrayList<>();
    }

    @Override
    protected void receiveTrackRequest(TrackRequest trackRequest) {
        trackRequests.add(trackRequest);
    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        tcName.setCellValueFactory(new PropertyValueFactory<>("name"));
        tcArtists.setCellValueFactory(new PropertyValueFactory<>("artists"));
        tcDuration.setCellValueFactory(new PropertyValueFactory<>("duration"));

        trackRequests = FXCollections.observableArrayList(tracks);
        tvTracks.setItems(trackRequests);
    }

    public void btnSendClick(ActionEvent actionEvent) {
        TrackRequest trackRequest = tvTracks.getSelectionModel().getSelectedItem();

        if (trackRequest != null) {
            this.sendMessage(trackRequest);
        }
    }
}
