import styles from '@/pages/NotFound.pcss';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { changeLocale } from '@/reducers/i18n';

const mapStateToProps = (state) => ({ t: state.i18n.messages });
const mapDispatchToProps = (dispatch) => bindActionCreators({ changeLocale }, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
export default class NotFound extends PureComponent {
  static propTypes = {
    t: PropTypes.object.isRequired
  }

  render() {
    const { t } = this.props;

    return (
      <Route render={({ staticContext }) => {
        if (staticContext) {
          staticContext.status = 404;
        }
        return (
          <div className={styles[`root`]}>
            <summary>
              <h1 className={styles[`h1`]}>{t[`not-found`]}</h1>
            </summary>
          </div>
        );
      }}/>
    );
  }
}