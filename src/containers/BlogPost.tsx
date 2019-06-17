import _ from 'lodash';
import moment from 'moment';
import { RichText } from 'prismic-dom';
import { Document } from 'prismic-javascript/d.ts/documents';
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { Action, bindActionCreators, Dispatch } from 'redux';
import styled from 'styled-components';
import withPrismicDoc from '../decorators/withPrismicDoc';
import { AppState } from '../store';
import { linkResolver } from '../utils/prismic';

interface StateProps {
  t: TranslationData;
  locale: string;
}

interface DispatchProps {
}

interface OwnProps {
  doc?: Document;
}

export interface Props extends StateProps, DispatchProps, OwnProps {}

export interface State {

}

class BlogPost extends PureComponent<Props, State> {
  render() {
    const { doc } = this.props;

    if (doc) document.title = RichText.asText(doc.data.title);

    return (
      <StyledRoot>
        { doc &&
          <Fragment>
            <StyledDate>{moment(doc.first_publication_date!).fromNow()}</StyledDate>
            <StyledTitle>{RichText.asText(doc.data.title)}</StyledTitle>
            <StyledBody>
              { doc.data.body.map((section: any) => {
                const sectionTitle = RichText.asText(section.primary.subtitle);
                const sectionRef = _.kebabCase(sectionTitle);

                return (
                  <section key={sectionRef}>
                    <h2>{sectionTitle}</h2>
                    { section.items.map((item: any, idx: number) => (
                      <div key={`${sectionRef}-${idx}`} dangerouslySetInnerHTML={{ __html: RichText.asHtml(item.content, doc => linkResolver(doc)) }}/>
                    )) }
                  </section>
                );
              })}
            </StyledBody>
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
)(withPrismicDoc('blog_post')(BlogPost));

const StyledRoot = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  font-family: ${props => props.theme.font};
  justify-content: center;
  padding: 10% 5%;
  width: 100%;
`;

const StyledDate = styled.span`
  color: ${props => props.theme.titleColor};
  font-size: 1rem;
  font-weight: 300;
  letter-spacing: 3px;
  margin: 0 0 20px;
  max-width: 550px;
  text-align: center;
  text-transform: lowercase;
`;

const StyledTitle = styled.h1`
  color: ${props => props.theme.titleColor};
  font-size: 5em;
  font-weight: 700;
  letter-spacing: 3px;
  margin: 0 0 50px;
  max-width: 550px;
  text-align: center;
  text-transform: uppercase;
`;

const StyledBody = styled.div`
  color: ${props => props.theme.textColor};
  line-height: 1.6em;
  text-align: center;
  max-width: 600px;

  h2 {
    color: ${props => props.theme.titleColor};
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
