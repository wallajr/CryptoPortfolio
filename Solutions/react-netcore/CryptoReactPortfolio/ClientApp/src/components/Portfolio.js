import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

export class Portfolio extends Component {
  displayName = Portfolio.name

  constructor(props) {
    super(props);
    this.state = { coinPortfolio: [], loading: true };

    fetch('api/portfolio/')
      .then(response => response.json())
      .then(data => {
        this.setState({ coinPortfolio: data, loading: false });
      });
  }

  static renderPortfolioTable(coinPortfolio) {
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
            {coinPortfolio.entries.map(entry =>
                <tr key={entry.symbol}>
                {<td><a href={""+entry.coinURL+""}>{entry.symbol}</a></td>}
                <td>{entry.tokensOwned}</td>
                <td>{entry.btcPerToken}</td>
                <td>{entry.usdPerToken}</td>
                <td>{entry.usdValue}</td>
                <td>{entry.btcValue}</td>
                <td>{entry.usdValue/coinPortfolio.totalUSDValue*100}%</td>
                <td>{entry.marketCap}</td>
                </tr>
            )}
            </tbody>
            <tfoot>
                <tr id="Totals_Row">
                    <td rowSpan="1" colSpan="1"><strong>Total</strong></td>
                    <td rowSpan="1" colSpan="1"></td>
                    <td rowSpan="1" colSpan="1"></td>
                    <td rowSpan="1" colSpan="1"></td>
                    <td styles="text-align: right" rowSpan="1" colSpan="1"><strong>{coinPortfolio.totalUSDValue}</strong></td>
                    <td styles="text-align: right" rowSpan="1" colSpan="1"><strong>{coinPortfolio.totalBTCValue}</strong></td>
                    <td rowSpan="1" colSpan="1"></td>
                    <td rowSpan="1" colSpan="1">
                    </td>
                </tr>
                <tr id="Investments_Row">
                    <td rowSpan="1" colSpan="1"><strong>Investments</strong></td>
                    <td rowSpan="1" colSpan="1"></td><td rowSpan="1" colSpan="1"></td>
                    <td styles="text-align: right" rowSpan="1" colSpan="1"><strong>Total</strong></td>
                    <td styles="text-align: right" rowSpan="1" colSpan="1"><strong>{coinPortfolio.totalInvestment}</strong></td>
                    <td styles="text-align: right" rowSpan="1" colSpan="1"><strong>ROI</strong></td>
                    <td styles="text-align: right" rowSpan="1" colSpan="1"><strong>{coinPortfolio.roi}</strong></td>
                    <td rowSpan="1" colSpan="1"></td></tr>
            </tfoot>
      </Table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : Portfolio.renderPortfolioTable(this.state.coinPortfolio);

    return (
      <div>
        <h1>Portfolio</h1>
        {contents}
      </div>
    );
  }
}