import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import { formatMoney } from '../utilities'

export class Financials extends Component {
  displayName = Financials.name

  constructor(props) {
    super(props);
    this.state = { coinFinancials: [], loading: true };

    fetch('api/portfolio/')
      .then(response => response.json())
      .then(data => {
        this.setState({ coinFinancials: data, loading: false });
      });
  }

  static renderPortfolioTable(coinFinancials) {
    return (
        <Table responsive striped bordered hover>
            <thead>
                <tr role="row">
                    <th rowSpan="1" colSpan="1" styles="width: 63px;">Coin</th>
                    <th styles="text-align: right; width: 103px;" rowSpan="1" colSpan="1">Tokens Owned</th>
                    <th styles="text-align: right; width: 160px;" rowSpan="1" colSpan="1">BTC Per Token</th>
                    <th styles="text-align: right; width: 105px;" rowSpan="1" colSpan="1">USD Per Token</th>
                    <th styles="text-align: right; width: 73px;"  rowSpan="1" colSpan="1">USD Value</th>
                    <th styles="text-align: right; width: 72px;"  rowSpan="1" colSpan="1">BTC Value</th>
                    <th styles="text-align: right; width: 113px;" rowSpan="1" colSpan="1">% of Total Value</th>
                    <th styles="text-align: right; width: 117px;" rowSpan="1" colSpan="1">Market Cap</th>
                </tr>
            </thead>
            <tbody>
            {coinFinancials.entries.map(entry =>
                <tr key={entry.symbol}>
                {<td><a href={""+entry.coinURL+""}>{entry.symbol}</a></td>}
                <td>{entry.tokensOwned}</td>
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
      : Financials.renderPortfolioTable(this.state.coinFinancials);

    return (
      <div>
        {contents}
      </div>
    );
  }
}