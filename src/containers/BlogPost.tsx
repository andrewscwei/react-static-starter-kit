import _ from 'lodash';
import moment from 'moment';
import PrismicDOM from 'prismic-dom';
import { Document } from 'prismic-javascript/d.ts/documents';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Action, bindActionCreators, Dispatch } from 'redux';
import styled from 'styled-components';
import { AppState } from '../store';
import { I18nState } from '../store/i18n';
import { fetchDocs, reduceDoc } from '../store/prismic';
import { linkResolver, localeResolver } from '../utils/prismic';

interface StateProps {
  i18n: I18nState;
  doc?: Document;
}

interface DispatchProps {
  fetchDocs: typeof fetchDocs;
}

interface OwnProps extends RouteComponentProps<{ uid: string }> {

}

interface Props extends StateProps, DispatchProps, OwnProps {}

interface State {

}

class BlogPost extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.props.fetchDocs('blog_post', this.props.match.params.uid, {
      lang: localeResolver(this.props.i18n.locale),
    });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const titleFragment = _.get(this.props.doc, 'data.title');
    const title = titleFragment && PrismicDOM.RichText.asText(titleFragment);
    if (title && document.title !== title) document.title = title;
  }

  render() {
    const date = _.get(this.props.doc, 'first_publication_date');
    const title = _.get(this.props.doc, 'data.title');
    const sections = _.get(this.props.doc, 'data.body');

    return (
      <StyledRoot>
        { date && <StyledDate>{moment(date).fromNow()}</StyledDate> }
        { title && <StyledTitle>{PrismicDOM.RichText.asText(title)}</StyledTitle> }
        <StyledBody>
          { sections && sections.map((section: any) => {
            const sectionTitle = PrismicDOM.RichText.asText(section.primary.subtitle);
            const sectionRef = _.kebabCase(sectionTitle);

            return (
              <section key={sectionRef}>
                <h2>{sectionTitle}</h2>
                { section.items.map((item: any, idx: number) => (
                  <div key={`${sectionRef}-${idx}`} dangerouslySetInnerHTML={{ __html: PrismicDOM.RichText.asHtml(item.content, (doc) => linkResolver(doc)) }}/>
                )) }
              </section>
            );
          })}
        </StyledBody>
      </StyledRoot>
    );
  }
}

export default connect(
  (state: AppState, ownProps: OwnProps): StateProps => ({
    i18n: state.i18n,
    doc: reduceDoc(state.prismic, 'blog_post', ownProps.match.params.uid, state.i18n.locale),
  }),
  (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({
    fetchDocs,
  }, dispatch),
)(BlogPost);

const StyledRoot = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  font-family: ${(props) => props.theme.fonts.body};
  justify-content: center;
  padding: 10% 5%;
  width: 100%;
`;

const StyledDate = styled.span`
  color: ${(props) => props.theme.colors.title};
  font-size: 1rem;
  font-weight: 300;
  letter-spacing: 3px;
  margin: 0 0 20px;
  max-width: 550px;
  text-align: center;
  text-transform: lowercase;
`;

const StyledTitle = styled.h1`
  color: ${(props) => props.theme.colors.title};
  font-size: 5em;
  font-weight: 700;
  letter-spacing: 3px;
  margin: 0 0 50px;
  max-width: 550px;
  text-align: center;
  text-transform: uppercase;
`;

const StyledBody = styled.div`
  color: ${(props) => props.theme.colors.text};
  line-height: 1.6em;
  text-align: center;
  max-width: 600px;

  h2 {
    color: ${(props) => props.theme.colors.title};
  }

  img {
    width: 100%;
    max-width: 320px;
    height: auto;
  }

  section:not(:last-child) {
    margin-bottom: 50px;
  }
`;
