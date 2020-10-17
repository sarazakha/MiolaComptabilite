import React, { Component } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';

class ChartPartiesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            programmeActuel: '',
            chartData: props.chartData
        }
    }

    componentDidMount() {
        this.getProgrammeActuel();
    }

    getProgrammeActuel() {
        axios.get("http://localhost:8080/programme-actuel")
            .then(response => {
                this.setState({ programmeActuel: response.data });
                console.log("Programme annee :" + this.state.programmeActuel.annee);
            });
    }

    static defaultProps = {
        displayTitle: true,
        displayLegend: true,
        legendPosition: 'right',
    }

    render() {
        return (
            <div>
                <Doughnut
                width="600px"
                height="500px"
                    data={this.state.chartData}
                    options={{
                        maintainAspectRatio: false,
                        title: {
                            display: this.props.displayTitle,
                            text: "Programme d'emploi " + this.state.programmeActuel.annee,
                            fontSize: 20
                        },
                        legend: {
                            display: this.props.displayLegend,
                            position: this.props.legendPosition,
                        }
                    }}
                />
            </div>
        );
    }
}

export default ChartPartiesComponent;