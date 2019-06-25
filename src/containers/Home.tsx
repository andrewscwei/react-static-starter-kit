import { RichText } from 'prismic-dom';
import { Document } from 'prismic-javascript/d.ts/documents';
import React, { ComponentType, Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { Action, bindActionCreators, Dispatch } from 'redux';
import styled from 'styled-components';
import ReactLogo from '../components/ReactLogo';
import withPageTitle from '../decorators/withPageTitle';
import withPrismicDoc from '../decorators/withPrismicDoc';
import { AppState } from '../store';

interface StateProps {}

interface DispatchProps {}

interface OwnProps {
  doc?: Document;
}

export interface Props extends StateProps, DispatchProps, OwnProps {}

export interface State {}

class Home extends PureComponent<Props, State> {
  render() {
    const { doc } = this.props;

    return (
      <StyledRoot>
        <StyledReactLogo/>
        { doc &&
          <Fragment>
            <h1>{RichText.asText(doc.data.title)}</h1>
            <p>v{__APP_CONFIG__.version} ({__APP_CONFIG__.buildNumber})</p>
            <p>{RichText.asText(doc.data.body)}</p>
          </Fragment>
        }
      </StyledRoot>
    );
  }
}

export default connect(
  (state: AppState): StateProps => ({
  }),
  (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({
  }, dispatch),
)(withPrismicDoc('home')(withPageTitle('home')(Home)));

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

const StyledReactLogo = styled(ReactLogo as ComponentType)`
  height: 200px;
  margin-bottom: 30px;
`;
