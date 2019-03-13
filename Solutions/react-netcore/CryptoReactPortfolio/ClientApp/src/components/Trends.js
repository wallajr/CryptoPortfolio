import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import { formatNumber, formatMoney } from '../utilities'

export class Trends extends Component {
  displayName = Trends.name

  constructor(props) {
    super(props);
    this.state = { coinTrends: [], loading: true };
    this.onSort = this.onSort.bind(this);

    fetch('api/trends/')
      .then(response => response.json())
      .then(data => {
        this.setState({ coinTrends: data,
                        loading: false,
                        sort: {
                          column: "symbol",
                          direction: 'asc',
                        }
                      });
      });
  }

   onSort(column) {
    return (function (e) {
      let direction = this.state.sort.direction;
    
      if (this.state.sort.column === column) {
        // Change the sort direction if the same column is sorted.
        direction = this.state.sort.direction === 'asc' ? 'desc' : 'asc';
      }

      // Sort ascending.
      let sortedData = this.state.coinTrends;
      sortedData.entries = this.state.coinTrends.entries.sort((a, b) => {
        if (column === 'symbol') {
          return ('' + a[column]).localeCompare(b[column]);
        }
        else {
          return a[column] - b[column];
        }
      });

      // Reverse the order if direction is descending.
      if (direction === 'desc') {
        sortedData.entries.reverse();
      }

      // Set the new state.
      this.setState({
        coinTrends: sortedData,
        sort: {
          column,
          direction,
        }
      });
    }).bind(this); // Bind "this" again because the onSort function is returning another function.
  }

  setArrow(column) {
    let className = 'sort-direction';
    
    if (this.state.sort.column === column) {
      className += this.state.sort.direction === 'asc' ? ' asc' : ' desc';
    }
    
    return className;
  };

   renderTrendsTable(coinTrends) {
    return (
        <Table responsive striped bordered hover>
            <thead>
                <tr role="row">
                    <th className="sortable" onClick={this.onSort('symbol')} styles="width: 63px;" rowSpan="1" colSpan="1" >Coin<span className={this.setArrow('symbol')}></span></th>
                    <th className="sortable" onClick={this.onSort('oneHour')} styles="text-align: right; width: 103px;" rowSpan="1" colSpan="1">1 Hour<span className={this.setArrow('oneHour')}></span></th>
                    <th className="sortable" onClick={this.onSort('sixHours')} styles="text-align: right; width: 160px;" rowSpan="1" colSpan="1">6 Hours<span className={this.setArrow('sixHours')}></span></th>
                    <th className="sortable" onClick={this.onSort('twelveHours')} styles="text-align: right; width: 105px;" rowSpan="1" colSpan="1">12 Hours<span className={this.setArrow('twelveHours')}></span></th>
                    <th className="sortable" onClick={this.onSort('twentyFourHours')} styles="text-align: right; width: 73px;"  rowSpan="1" colSpan="1">24 Hours<span className={this.setArrow('twentyFourHours')}></span></th>
                    <th className="sortable" onClick={this.onSort('sevenDays')} styles="text-align: right; width: 72px;"  rowSpan="1" colSpan="1">7 Days<span className={this.setArrow('sevenDays')}></span></th>
                    <th className="sortable" onClick={this.onSort('thirtyDays')} styles="text-align: right; width: 113px;" rowSpan="1" colSpan="1">30 Days<span className={this.setArrow('thirtyDays')}></span></th>
                </tr>
            </thead>
            <tbody>
            {coinTrends.entries.map(entry =>
                <tr key={entry.symbol}>
                    <td>
                      <a href={""+entry.coinURL+""}>{entry.symbol}</a>
                    </td>
                    <td style={{color: entry.oneHourPercentage > 0 ? 'green' : 'red'}}>
                      {entry.oneHourPercentage}%
                    </td>
                    <td style={{color: entry.sixHoursPercentage > 0 ? 'green' : 'red'}}>
                      {entry.sixHoursPercentage}%
                    </td>
                    <td style={{color: entry.twelveHoursPercentage > 0 ? 'green' : 'red'}}>
                      {entry.twelveHoursPercentage}%
                    </td>
                    <td style={{color: entry.twentyFourHoursPercentage > 0 ? 'green' : 'red'}}>
                      {entry.twentyFourHoursPercentage}%
                    </td>
                    <td style={{color: entry.sevenDaysPercentage > 0 ? 'green' : 'red'}}>
                      {entry.sevenDaysPercentage}%
                    </td>
                    <td style={{color: entry.thirtyDaysPercentage > 0 ? 'green' : 'red'}}>
                      {entry.thirtyDaysPercentage}%
                    </td>
                </tr>
            )}
            </tbody>
        </Table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : this.renderTrendsTable(this.state.coinTrends);

    return (
      <div>
        {contents}
      </div>
    );
  }
}