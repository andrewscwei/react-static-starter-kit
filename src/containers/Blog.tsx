import moment from 'moment';
import PrismicDOM from 'prismic-dom';
import { Document } from 'prismic-javascript/d.ts/documents';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Action, bindActionCreators, Dispatch } from 'redux';
import styled from 'styled-components';
import { AppState } from '../store';
import { I18nState } from '../store/i18n';
import { fetchDocs, reduceDocs } from '../store/prismic';
import { getLocalizedPath } from '../utils/i18n';
import { localeResolver } from '../utils/prismic';

interface StateProps {
  i18n: I18nState;
  docs?: ReadonlyArray<Document>;
}

interface DispatchProps {
  fetchDocs: typeof fetchDocs;
}

interface OwnProps extends RouteComponentProps<{}> {

}

interface Props extends StateProps, DispatchProps, OwnProps {}

interface State {

}

class Blog extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.props.fetchDocs('blog_post', undefined, {
      lang: localeResolver(this.props.i18n.locale),
    });
  }

  componentDidMount() {
    document.title = this.props.i18n.ltxt('blog');
  }

  render() {
    const { locale } = this.props.i18n;

    return (
      <StyledRoot>
        { this.props.docs &&
          <StyledLinks>
            { this.props.docs.map((doc) => (
              <Link key={doc.id} to={getLocalizedPath(`/blog/${doc.uid}`, locale)}>
                <span>{moment(doc.first_publication_date!).fromNow()}</span>
                <h3>{PrismicDOM.RichText.asText(doc.data.title)}</h3>
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
    i18n: state.i18n,
    docs: reduceDocs(state.prismic, 'blog_post', state.i18n.locale),
  }),
  (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({
    fetchDocs,
  }, dispatch),
)(Blog);

const StyledRoot = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  font-family: ${(props) => props.theme.fonts.body};
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
    color: ${(props) => props.theme.colors.link};
    cursor: pointer;
    font-family: ${(props) => props.theme.fonts.body};
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
