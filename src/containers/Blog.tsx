import _ from 'lodash';
import moment from 'moment';
import { RichText } from 'prismic-dom';
import { Document } from 'prismic-javascript/d.ts/documents';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Action, bindActionCreators, Dispatch } from 'redux';
import styled from 'styled-components';
import withPageTitle from '../decorators/withPageTitle';
import withPrismicDocs from '../decorators/withPrismicDocs';
import { getLocalizedPath } from '../routes';
import { AppState } from '../store';
import { I18nState } from '../store/i18n';

interface StateProps {
  ltxt: I18nState['ltxt'];
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

class Blog extends PureComponent<Props, State> {
  render() {
    const { locale } = this.props;
    const docs = _.get(this.props.docs, locale) as ReadonlyArray<Document> | undefined;

    return (
      <StyledRoot>
        { docs &&
          <StyledLinks>
            { docs.map(doc => (
              <Link key={doc.id} to={getLocalizedPath(`/blog/${doc.uid}`, locale)}>
                <span>{moment(doc.first_publication_date!).fromNow()}</span>
                <h3>{RichText.asText(doc.data.title)}</h3>
              </Link>
            )) }
          </StyledLinks>
        }
      </StyledRoot>
    );
  }
}

export default connect(
  (state: AppState): StateProps => ({
    ltxt: state.i18n.ltxt,
    locale: state.i18n.locale,
  }),
  (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({
  }, dispatch),
)(withPrismicDocs('blog_post')(withPageTitle('blog')(Blog)));

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
`;

const StyledLinks = styled.ul`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;

  > a {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    color: ${props => props.theme.linkColor};
    cursor: pointer;
    font-family: ${props => props.theme.font};
    text-decoration: none;
    transition: all .2s ease-out;

    span {
      display: block;
      font-size: 1rem;
      font-weight: 300;
      opacity: .6;
      letter-spacing: 1px;
      margin-bottom: 4px;
      text-transform: lowercase;
    }

    h3 {
      font-size: 1.6rem;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin: 0;
    }

    :hover {
      opacity: .6;
    }

    :not(:last-child) {
      margin-bottom: 18px;
    }
  }
`;
