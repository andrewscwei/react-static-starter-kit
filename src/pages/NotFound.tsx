import { changeLocale } from '@/reducers/i18n';
import { Translations } from '@/types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';

const styles = require(`./NotFound.pcss`);

const mapStateToProps = (state): Partial<Props> => ({ t: state.i18n.messages });
const mapDispatchToProps = (dispatch): Partial<Props> => bindActionCreators({ changeLocale: changeLocale }, dispatch);

interface Props {
  t: Translations;
  changeLocale: (locale: string) => void;
}

class NotFound extends PureComponent<Props> {
  render() {
    const { t } = this.props;

    return (
      <Route render={ () => {
        return (
          <div className={styles[`root`]}>
            <summary>
              <h1 className={styles[`h1`]}>{t[`not-found`]}</h1>
            </summary>
          </div>
        );
      } }/>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotFound);
