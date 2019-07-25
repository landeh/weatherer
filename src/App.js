import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import LinearProgress from '@material-ui/core/LinearProgress';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';


class App extends React.Component {

  state = {
    weather: null,
    loading: false,
    text: '',
  }

  getweather = async (e) => {
    e.preventDefault()
    this.setState({ loading: true, weather: null })
    var key = '40d804d33262c225c2e9710528772851'
    var url = `https://api.openweathermap.org/data/2.5/forecast?q=${this.state.text}&units=imperial&APPID=${key}`
    var r = await fetch(url)
    var json = await r.json()
    if (r.status === 200) {
      this.setState({ weather: json.list, loading: false, text: '' })
    } else{
      this.setState({error:json.message, loading:false})
    }
  }

  render() {
    var { weather, loading, text, error } = this.state
    var data
    if (weather) {
      data = {
        labels: weather.map(w => moment(w.dt * 1000).format('MMMM Do YYYY, h:mm a')),
        datasets: [{
          label: 'Temperature',
          borderWidth: 1,
          data: weather.map(w => w.main.temp),
          backgroundColor: 'rgba(132,99,255,0.2)',
          borderColor: 'rgba(132,99,255,1)',
          hoverBackgroundColor: 'rgba(132,99,255,0.4)',
          hoverBorderColor: 'rgba(132,99,255,1)'
        }]
      }
    }
    return (
      <div className="App">
        <form className="App-header" onSubmit={this.getweather}>
          <TextField value={text}
            autoFocus
            variant="outlined"
            label="Search for weather"
            onChange={e => this.setState({ text: e.target.value })}
            style={{ width: '100%', marginLeft: 8 }}
          />
          <Button variant="contained"
            color="primary"
            disabled={loading || !text}
            type="submit"
            style={{ width: 150, margin: '0 10px', height: 75 }}>
            <SearchIcon style={{ marginRight: 8 }} />
            Search
          </Button>
        </form>
        {loading && <LinearProgress />}
        <main>
          {data && <Bar
            data={data}
            width={100}
            height={50}
            options={{ maintainAspectRatio: true }}
          />}
          {error}
        </main>
      </div>
    );
  }
}

export default App;