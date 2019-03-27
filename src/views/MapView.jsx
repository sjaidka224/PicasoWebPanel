import React, { Component } from 'react'
import 'material-icons'
import '../css/MapView.css'
import API from "../helper/api";

export default class MapView extends Component {

    constructor (props) {
        super (props);

        this.state = {
            floorLevel: 1,
            currentFloor: [],
            users: null,      // list of users
            globalActivity: null,   // api will give all users activity
            userActivity: null, // will get specific user activity
            currentUser: {},
            activeDeviceId: null,
            selected: null,
            roomDevices: null,
            timeOutside: 0,
            numberOfPeopleInRoom1: 0,
            numberOfPeopleInRoom2: 0,
            numberOfPeopleInRoom3: 0,
        };
    }

    componentDidMount() {
        API.getAllDevices(this.stateHandler)
        API.getUsersActivity(this.stateHandler)
    }

    stateHandler = (state) => {
        this.setState(state);
        console.log(state.globalActivity);
        console.log (state.roomDevices);
        this.calculateNumberOfPeopleInRoom()
    };

    calculateDistanceAway = () => {
        let homeRoom = 0
        let userActivity = this.state.userActivity.slice()
        let selectedKey = this.state.key
        let time = 0
        if (selectedKey === 0) {
            time = 0
        }
        else {
            while (userActivity[selectedKey].deviceId !== userActivity[homeRoom].deviceId) {
                time = time + (Date.parse(userActivity[selectedKey + 1].timestamp) - Date.parse(userActivity[selectedKey].timestamp))
                selectedKey = selectedKey + 1;
                console.log(time)
            }
        }

        this.setState({
            timeOutside: time
        })
    };

    calculateNumberOfPeopleInRoom = () => {

        console.log (this.state.roomDevices);
        for (let i = 0; i < this.state.roomDevices.length; i++) {
            console.log ("this.state.roomDevices");
            let deviceObj = this.state.roomDevices[i];
            let deviceId = deviceObj.deviceId;
            let roomId = deviceObj.roomId;
            let numberOfPeople = 0;
            for (let j = 0; j < this.state.globalActivity.length; j++) {
                let userObj = this.state.globalActivity[j];
                let userRoomVisited = userObj.deviceId;
                if (deviceId === userRoomVisited) {
                    if (roomId === "MeetingRoom1") {
                        numberOfPeople++;
                        this.setState({
                            numberOfPeopleInRoom1 : numberOfPeople
                        });
                    } else if (roomId === "MeetingRoom2") {
                        numberOfPeople++;
                        this.setState({
                            numberOfPeopleInRoom2 : numberOfPeople
                        });
                    } else {
                        numberOfPeople++;
                        this.setState({
                            numberOfPeopleInRoom3 : numberOfPeople
                        });
                    }

                }
            }

        }
        console.log("numb", this.state.numberOfPeopleInRoom1, " ", this.state.numberOfPeopleInRoom2, " ", this.state.numberOfPeopleInRoom3);
    };

    render() {

        return (
            <div className="rooms">
                <div className="main-content">
                    <div className="row">

                        <div className=" left-align col s3 m3 l3 room_1_div">
                            <p>Room 1</p>
                            <p>{this.state.numberOfPeopleInRoom1}</p>
                        </div>
                        <div className="col s3 m3 l3 room_2_div">
                            <p>Room 2</p>
                            <p>{this.state.numberOfPeopleInRoom2}</p>
                        </div>


                    </div>

                    <div className="row">
                        <div className="col s3 m3 l3 room_3_div">
                            <p>Empty Room</p>
                        </div>
                        <div className="col s3 m3 l3 room_4_div">
                            <p>Empty Room</p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col s3 m3 l3 room_3_div">
                            <p>Room 3</p>
                            <p>{this.state.numberOfPeopleInRoom3}</p>
                        </div>
                    </div>
                </div>

                <div className="details_table main_content">
                    <div className="table col s3 m3 l3">
                        <table>
                            <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Room ID</th>
                                <th>Time Stamp</th>
                            </tr>
                            </thead>

                            <tbody>
                            {
                                this.state.globalActivity !== null ? (
                                    this.state.globalActivity.map((object, key) => {
                                        return (
                                            <tr key={key}>
                                                <td>{object.userId}
                                                </td>
                                                <td>{object.deviceId}</td>
                                                <td>{object.timestamp}</td>
                                            </tr>
                                        )
                                    })
                                )  : null
                            }
                            </tbody>
                        </table>

                    </div>

                </div>
            </div>
        )
    }
}


/*

 <div className="rows">
                        <div className="room_1_div common_div">
                            <p  className="room_1_numberOfDevices_p">Room 1</p>
                        </div>
                        <div className="room_2_div common_div">
                            <p>Room 2</p>
                        </div>
                    </div>
                    <div className="rows">
                        <div className="room_3_div common_div">
                            <p>Empty Room 1</p>
                        </div>
                        <div className="room_4_div common_div">
                            <p>Empty Room 2</p>
                        </div>
                    </div>
                    <div className="room_5_div common_div">
                        <p>Room 3</p>
                    </div>
 */