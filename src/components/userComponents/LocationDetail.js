import React from 'react'
import queryString from 'query-string'
import { database} from 'firebase'
import Loader from '../Loader'
import SlotView from '../views/SlotView'
import { DatePicker, TimePicker} from 'material-ui'

export default class LocationDetail extends React.Component{
    constructor(props){
        super(props)
        let obj = queryString.parse(window.location.search);
        var date = new Date();
        date.setHours(0,0,0,0)
        var startTime = new Date();
        var endTime = new Date(); 
        endTime.setHours((endTime.getHours()+1)) 
        console.log(date,startTime,endTime)
        this.state ={
            areaname: obj.areaname,
            arr: [],
            date,
            startTime,
            endTime,
            loading: true
        }
    }
    componentDidMount(){
        database().ref('AREAS/'+this.state.areaname).on('value',snap => {
            console.log(snap.val())
            if(snap.val()){this.setState({arr: snap.val(),loading:false})}
        })
    }
    render(){
        let areaname = this.state.areaname;
        let arr = this.state.arr;
        return(
            <div>
                <h1 className="text-center">
                    Area Name: {areaname}
                </h1>
                {this.state.loading?
                    <Loader/>
                :
                    <div style={{display: 'flex', alignItems: 'center' ,flexDirection:'column'}}>
                        <h2 className="text-center">Select Date And Time</h2>
                        <div>
                            <TimePicker defaultTime={this.state.startTime} onChange={(...arg) => {this.setState({startTime: arg[1]})}}  style={{display: 'inline-block'}} floatingLabelText="Start Time" autoOk={true}/>
                            <TimePicker defaultTime={this.state.endTime} onChange={(...arg) => {this.setState({endTime: arg[1]})}} style={{display: 'inline-block'}} floatingLabelText="End Time" autoOk={true}/>
                            <DatePicker autoOk={true} minDate={new Date()} defaultDate={this.state.date} onChange={(...arg) => {this.setState({date: arg[1]})}} style={{display: 'inline-block'}} floatingLabelText="Select Date" />
                        </div>
                        <h3 className="text-center">Total Slot : {arr.length} 
                            {/*"Date"+this.state.date+"startTime"+this.state.startTime+"endTime"+this.state.endTime*/}
                            </h3>
                        <div style={{maxWidth: 880,display:'block'}}>
                            {
                                arr.map((el, ind) => (
                                    <div className="col-xs-2" key={ind}>
                                        <SlotView slot={el} date={this.state.date} startTime={this.state.startTime} endTime={this.state.endTime} index={ind} parrentNode={areaname} />
                                    </div>
                                ))
                            }    
                        </div>    
                    </div>
                }
            </div>
        )
    }
}