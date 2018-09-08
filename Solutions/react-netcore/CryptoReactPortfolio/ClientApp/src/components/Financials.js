import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import { formatNumber, formatMoney } from '../utilities'

export class Financials extends Component {
  displayName = Financials.name

  constructor(props) {
    super(props);
    this.state = { coinFinancials: [], loading: true };
    this.onSort = this.onSort.bind(this);

    fetch('api/portfolio/')
      .then(response => response.json())
      .then(data => {
        this.setState({ coinFinancials: data,
                        loading: false,
                        sort: {
                          column: "usdValue",
                          direction: 'desc',
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
      let sortedData = this.state.coinFinancials;
      sortedData.entries = this.state.coinFinancials.entries.sort((a, b) => {
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
        coinFinancials: sortedData,
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

   renderPortfolioTable(coinFinancials) {
    return (
        <Table responsive striped bordered hover>
            <thead>
                <tr role="row">
                    <th className="sortable" onClick={this.onSort('symbol')} styles="width: 63px;" rowSpan="1" colSpan="1" >Coin<span className={this.setArrow('symbol')}></span></th>
                    <th className="sortable" onClick={this.onSort('tokensOwned')} styles="text-align: right; width: 103px;" rowSpan="1" colSpan="1">Tokens Owned<span className={this.setArrow('tokensOwned')}></span></th>
                    <th className="sortable" onClick={this.onSort('btcPerToken')} styles="text-align: right; width: 160px;" rowSpan="1" colSpan="1">BTC Per Token<span className={this.setArrow('btcPerToken')}></span></th>
                    <th className="sortable" onClick={this.onSort('usdPerToken')} styles="text-align: right; width: 105px;" rowSpan="1" colSpan="1">USD Per Token<span className={this.setArrow('usdPerToken')}></span></th>
                    <th className="sortable" onClick={this.onSort('usdValue')} styles="text-align: right; width: 73px;"  rowSpan="1" colSpan="1">USD Value<span className={this.setArrow('usdValue')}></span></th>
                    <th className="sortable" onClick={this.onSort('btcValue')} styles="text-align: right; width: 72px;"  rowSpan="1" colSpan="1">BTC Value<span className={this.setArrow('btcValue')}></span></th>
                    <th className="sortable" onClick={this.onSort('usdValue')} styles="text-align: right; width: 113px;" rowSpan="1" colSpan="1">% of Total Value<span className={this.setArrow('usdValue')}></span></th>
                    <th className="sortable" onClick={this.onSort('marketCap')} styles="text-align: right; width: 117px;" rowSpan="1" colSpan="1">Market Cap<span className={this.setArrow('marketCap')}></span></th>
                </tr>
            </thead>
            <tbody>
            {coinFinancials.entries.map(entry =>
                <tr key={entry.symbol}>
                {<td><a href={""+entry.coinURL+""}>{entry.symbol}</a></td>}
                <td>{formatNumber(entry.tokensOwned)}</td>
                <td>{entry.btcPerToken.toFixed(8)}</td>
                <td>{formatMoney(entry.usdPerToken)}</td>
                <td>{formatMoney(entry.usdValue)}</td>
                <td>{entry.btcValue.toFixed(8)}</td>
                <td>{(entry.usdValue/coinFinancials.totalUSDValue*100).toFixed(2)}%</td>
                <td>{formatMoney(entry.marketCap)}</td>
                </tr>
            )}
            </tbody>
            <tfoot>
                <tr id="Totals_Row">
                    <td rowSpan="1" colSpan="1"><strong>Total</strong></td>
                    <td rowSpan="1" colSpan="1"></td>
                    <td rowSpan="1" colSpan="1"></td>
                    <td rowSpan="1" colSpan="1"></td>
                    <td styles="text-align: right" rowSpan="1" colSpan="1"><strong>{formatMoney(coinFinancials.totalUSDValue)}</strong></td>
                    <td styles="text-align: right" rowSpan="1" colSpan="1"><strong>{coinFinancials.totalBTCValue.toFixed(8)}</strong></td>
                    <td rowSpan="1" colSpan="1"></td>
                    <td rowSpan="1" colSpan="1">
                    </td>
                </tr>
                <tr id="Investments_Row">
                    <td rowSpan="1" colSpan="1"><strong>Investments</strong></td>
                    <td rowSpan="1" colSpan="1"></td><td rowSpan="1" colSpan="1"></td>
                    <td styles="text-align: right" rowSpan="1" colSpan="1"><strong>Total</strong></td>
                    <td styles="text-align: right" rowSpan="1" colSpan="1"><strong>{formatMoney(coinFinancials.totalInvestment)}</strong></td>
                    <td styles="text-align: right" rowSpan="1" colSpan="1"><strong>ROI</strong></td>
                    <td styles="text-align: right" rowSpan="1" colSpan="1"><strong>{coinFinancials.roi.toFixed(2)}</strong></td>
                    <td rowSpan="1" colSpan="1"></td></tr>
            </tfoot>
      </Table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : this.renderPortfolioTable(this.state.coinFinancials);

    return (
      <div>
        {contents}
      </div>
    );
  }
}