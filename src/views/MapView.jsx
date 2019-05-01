import React, {Component} from 'react'
import 'material-icons'
import '../css/MapView.css'
import Moment from 'react-moment'
import 'moment-timezone';
import API from "../helper/api";

export default class MapView extends Component {

    constructor(props) {
        super(props);
        this.calculateNumberOfPeopleInRoom = this.calculateNumberOfPeopleInRoom.bind(this);
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
            currentDate: "",
            time: 0,
            start: 0,
            filteredArray: []
        };
        this.startTimer = this.startTimer.bind(this);
        this.resetTimer = this.resetTimer.bind(this);
    }

    componentDidMount() {
        API.getAllDevices(this.stateHandler);
        API.getUsersActivity(this.stateHandler);

        this.startTimer();
        let self = this;
        setInterval(function () {
            console.log ("in here");
            //API.getUsersActivity(self.stateHandler);
            self.calculateNumberOfPeopleInRoom();
            self.resetTimer();
            self.startTimer();
        }, 100000);

    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    startTimer = () => {
        this.setState({
            time: this.state.time,
            start: Date.now() - this.state.time
        });
        this.timer = setInterval(() => this.setState({
            time: Date.now() - this.state.start
        }), 1);
    };

    resetTimer() {
        console.log ("here");
        this.setState({time: 0})
    };

    stateHandler = (state) => {
        this.setState(state);
        this.calculateNumberOfPeopleInRoom();
    };

    calculateDistanceAway = () => {
        let homeRoom = 0;
        let userActivity = this.state.userActivity.slice();
        let selectedKey = this.state.key;
        let time = 0;
        if (selectedKey === 0) {
            time = 0;
        } else {
            while (userActivity[selectedKey].deviceId !== userActivity[homeRoom].deviceId) {
                time = time + (Date.parse(userActivity[selectedKey + 1].timestamp) - Date.parse(userActivity[selectedKey].timestamp));
                selectedKey = selectedKey + 1;
                console.log(time);
            }
        }

        this.setState({
            timeOutside: time
        })
    };

    filterDataOnBasisOfDateAndTime = (roomId) => {

        let newGlobalArray = this.state.globalActivity.filter(user => user.deviceId === roomId);

        let arrayFilteredAccToDateAndTime = [];

        while (newGlobalArray.length !== 0) {
            console.log("Counter");
            let user0 = newGlobalArray[0];

            let usersWithSameDate = this.state.globalActivity.filter(user => new Date(user.timestamp).getDate() === new Date(user0.timestamp).getDate());
            newGlobalArray = newGlobalArray.filter(val => !usersWithSameDate.includes(val));


            let beforeNoon = usersWithSameDate.filter(obj => new Date(obj.timestamp).getHours() < 12);

            let afterNoon = usersWithSameDate.filter(obj => new Date(obj.timestamp).getHours() > 12);

            let newObj = {
                date : new Date(usersWithSameDate[0].timestamp),
                beforeNoon : beforeNoon,
                afterNoon : afterNoon
            };
            arrayFilteredAccToDateAndTime.push(newObj);
        }


        console.log(arrayFilteredAccToDateAndTime);

    };

    calculateNumberOfPeopleInRoom = () => {

        let usersInRoom = this.state.globalActivity.filter(user => user.deviceId === "427148817");
        this.setState({
            numberOfPeopleInRoom1: usersInRoom.length
        });
        usersInRoom = this.state.globalActivity.filter(user => user.deviceId === "4938530174");
        this.setState({
            numberOfPeopleInRoom2: usersInRoom.length
        });
        usersInRoom = this.state.globalActivity.filter(user => user.deviceId === "1500011000");
        this.setState({
            numberOfPeopleInRoom3: usersInRoom.length
        });

        /*

        for (let i = 0; i < this.state.roomDevices.length; i++) {

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
        */

    };



    render() {

        return (
            <div className="rooms">
                <div>
                    <p>Refreshing in {100 - (this.state.time/1000).toFixed(0)} </p>
                </div>
                <div className="main-content">
                    <div className="row">

                        <div className=" left-align col s3 m3 l3 room_1_div">
                            <p>Room 1</p>
                            <p> {this.state.numberOfPeopleInRoom1}</p>
                            <button value={"427148817"} onClick={() => this.filterDataOnBasisOfDateAndTime("427148817")}> Click here </button>
                        </div>
                        <div className="col s3 m3 l3 room_2_div">
                            <p>Room 2</p>
                            <p>{this.state.numberOfPeopleInRoom2}</p>
                            <button value={"4938530174"} onClick={() => this.filterDataOnBasisOfDateAndTime("4938530174")}> Click here </button>
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
                            <button value={"1500011000"} onClick={() => this.filterDataOnBasisOfDateAndTime("1500011000")}> Click here </button>
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
                                                <td>
                                                    <Moment format="MMMM Do YYYY, h:mm:ss a" date={object.timestamp}/>

                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : null
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