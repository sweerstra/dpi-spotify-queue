package app;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.Initializable;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.TextField;
import javafx.scene.control.cell.PropertyValueFactory;
import models.TrackRequest;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;
import java.util.stream.Collectors;

public class BrokerController implements Initializable {
    public TableView<TrackRequest> tvTracks;
    public TableColumn<TrackRequest, String> tcName;
    public TableColumn<TrackRequest, String> tcArtists;
    public TableColumn<TrackRequest, Integer> tcDuration;
    public TextField tfGroup;

    private BrokerClientAppGateway clientAppGateway;
    private BrokerMediatorAppGateway mediatorAppGateway;
    private ObservableList<TrackRequest> trackRequests;
    private List<TrackRequest> tracks;
    private String groupName;

    public BrokerController() {
        tracks = new ArrayList<>();
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
            this.mediatorAppGateway.sendMessage(trackRequest);
        }
    }

    public void btnPlayTracksClick(ActionEvent actionEvent) {
        List<String> uris = trackRequests.stream()
                .map(TrackRequest::getUri)
                .collect(Collectors.toList());

        mediatorAppGateway.sendMessage(uris, groupName);
    }

    public void btnSetGroupClick(ActionEvent actionEvent) {
        String group = tfGroup.getText();

        if (!group.isEmpty()) {
            groupName = group;

            clientAppGateway = new BrokerClientAppGateway(groupName) {
                @Override
                protected void receiveSuggestionRequest(TrackRequest track) {
                    trackRequests.add(track);

                    System.out.println("Suggestion Request, with Ajax");
                }
            };

            mediatorAppGateway = new BrokerMediatorAppGateway(groupName) {
                @Override
                protected void receiveTrackResponse(String tracksJson) {
                    clientAppGateway.sendMessage(tracksJson);
                    System.out.println("Track Response, from Node.js");
                    System.out.println(tracksJson);
                }
            };
        }
    }
}
