import React from 'react';

import { connect } from 'react-redux';
import { setIndicatorPage, setIndicatorRowsPerPage, setIndicatorRowTotal } from './../../actions/indicatorList';

import { Query } from 'react-apollo';
import IndicatorRepository from './../../repository/IndicatorRepository';
import { GraphQLError } from './../Error/GraphQLError';

import ListTable from '../ListTable/ListTable';
import LinkButton from './../../Components/FormInput/LinkButton';
import AddIcon from '@material-ui/icons/Add';

class IndicatorList extends React.Component {
  render() {
    return (
      <Query
        query={IndicatorRepository.getListPage()}
        variables={{ 'first': this.props.indicatorRowsPerPage, 'offset': this.props.indicatorPage * this.props.indicatorRowsPerPage }}
        fetchPolicy={this.props.refetch ? 'cache-and-network' : 'cache-first'}
      >
        {({ loading, error, data }) => {
          if (loading) {
            return <p>Loading...</p>;
          }
          if (error) {
            return <GraphQLError error={error} />;
          }
          this.props.setIndicatorRowTotal(data.allIndicators.totalCount);
          return (
            <div>
              <div style={{ 'float': 'left', 'marginLeft': '60px' }}>
                Indicators
              </div>
              <div style={{ 'float': 'right' }}>
                <LinkButton label=<AddIcon /> type="create" color="secondary" variant="fab" to={'/indicator/new'}/>
              </div>
              <ListTable
                data={data.allIndicators.nodes}
                buttons={[
                  { 'function': 'edit', 'parameter': '/indicator' },
                  { 'function': 'delete', 'parameter': this._buildDeleteParam() }
                ]}
                footerParams={this._buildFooterParam()}
              />
            </div>
          );
        }}
      </Query>
    );
  }

  _buildDeleteParam() {
    return {
      'page': this.props.indicatorPage,
      'rowTotal': this.props.indicatorRowTotal,
      'rowsPerPage': this.props.indicatorRowsPerPage,
      'setPage': this.props.setIndicatorPage,
      'repository': IndicatorRepository
    };
  }

  _buildFooterParam() {
    return {
      'page': this.props.indicatorPage,
      'rowTotal': this.props.indicatorRowTotal,
      'rowsPerPage': this.props.indicatorRowsPerPage,
      'setPage': this.props.setIndicatorPage,
      'setRowsPerPage': this.props.setIndicatorRowsPerPage
    };
  }
}

const mapStateToProps = (state) => ({
  'indicatorPage': state.indicatorPage,
  'indicatorRowsPerPage': state.indicatorRowsPerPage,
  'indicatorRowTotal': state.indicatorRowTotal
});

const mapDispatchToProps = (dispatch) => ({
  'setIndicatorPage': (page) => dispatch(setIndicatorPage(page)),
  'setIndicatorRowsPerPage': (rowsPerPage) => dispatch(setIndicatorRowsPerPage(rowsPerPage)),
  'setIndicatorRowTotal': (rowTotal) => dispatch(setIndicatorRowTotal(rowTotal))
});

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorList);
