import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

@connect(
  (state) => ({
    i18n: state.i18n,
  }),
  (dispatch) => bindActionCreators({

  }, dispatch),
)
export default class NotFound extends PureComponent {
  static propTypes = {
    i18n: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    document.title = this.props.i18n.ltxt('not-found');
  }

  render() {
    const { ltxt } = this.props.i18n;

    return (
      <Route render={(route) => {
        if (route.staticContext) {
          route.staticContext.statusCode = 404;
        }

        return (
          <StyledRoot>
            <h1>{ltxt('not-found-title')}</h1>
          </StyledRoot>
        );
      }}/>
    );
  }
}

const StyledRoot = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  font-family: ${props => props.theme.fonts.body};
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
  justify-content: center;
  padding: 10% 5%;
  position: absolute;
  width: 100%;

  h1 {
    color: ${props => props.theme.colors.title};
    font-size: 2.4em;
    font-weight: 700;
    letter-spacing: 3px;
    margin: 0;
    max-width: 550px;
    text-align: center;
    text-transform: uppercase;
  }
`;
