import React, { Component } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { Financials } from './Financials';

export class Assets extends Component {
    displayName = Assets.name

    constructor(props) {
        super(props);

        this.handleSelect = this.handleSelect.bind(this);
        this.state = { showFinancialTable: true, key: 1 };
      }

      handleSelect(key) {
        this.setState({ key });
      }

      render() {
          return (
              <div>
                <h1>Assets</h1>
                <Tabs
                    activeKey={this.state.key}
                    onSelect={this.handleSelect}
                    id="controlled-tab-example"
                >
                    <Tab eventKey={1} title="Financials">
                        <Financials></Financials>
                    </Tab>
                    <Tab eventKey={2} title="Trends">
                    Tab 2 content
                    </Tab>
                </Tabs>
            </div>
          )
      }

}