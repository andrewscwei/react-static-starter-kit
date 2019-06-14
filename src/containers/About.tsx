import _ from 'lodash';
import { RichText } from 'prismic-reactjs';
import React, { Fragment, PureComponent } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Action, bindActionCreators, Dispatch } from 'redux';
import styled from 'styled-components';
import withPrismicDoc from '../decorators/withPrismicDoc';
import { AppState } from '../store';

interface StateProps {
  t: TranslationData;
  locale: string;
}

interface DispatchProps {
}

interface OwnProps {
  docs?: { [locale: string]: ReadonlyArray<Document>};
}

export interface Props extends StateProps, DispatchProps, OwnProps {}

export interface State {

}

class About extends PureComponent<Props, State> {
  render() {
    const { t, docs, locale } = this.props;
    const doc = _.get(docs, `${locale}[0]`) as any;

    return (
      <StyledRoot>
        <Helmet>
          <title>{t['about']}</title>
        </Helmet>
        { doc &&
          <Fragment>
            <h1>{RichText.asText(doc!.data.title)}</h1>
            <p>{RichText.asText(doc!.data.body)}</p>
          </Fragment>
        }
      </StyledRoot>
    );
  }
}

export default connect(
  (state: AppState): StateProps => ({
    t: state.intl.translations,
    locale: state.intl.locale,
  }),
  (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({
  }, dispatch),
)(withPrismicDoc('about')(About));

const StyledRoot = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  font-family: ${props => props.theme.font};
  height: 100%;
  justify-content: center;
  padding: 10% 5%;
  position: absolute;
  width: 100%;

  h1 {
    color: ${props => props.theme.titleColor};
    font-size: 5em;
    font-weight: 700;
    letter-spacing: 3px;
    margin: 0;
    max-width: 550px;
    text-align: center;
    text-transform: uppercase;
  }

  p {
    color: ${props => props.theme.textColor};
    font-weight: 400;
    letter-spacing: .6px;
    line-height: 1.6em;
    margin: 0;
    max-width: 400px;
    text-align: center;
  }
`;
