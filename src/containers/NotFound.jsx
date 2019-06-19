import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

@connect(
  (state) => ({
    ltxt: state.i18n.ltxt,
  }),
  (dispatch) => bindActionCreators({

  }, dispatch),
)
export default class NotFound extends PureComponent {
  static propTypes = {
    ltxt: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    document.title = this.props.ltxt('not-found-title');
  }

  render() {
    const { ltxt } = this.props;

    return (
      <Route render={(route) => {
        if (route.staticContext) {
          route.staticContext.statusCode = 404;
        }

        return (
          <StyledRoot>
            <h1>{ltxt('not-found')}</h1>
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
  font-family: ${props => props.theme.font};
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
  justify-content: center;
  padding: 10% 5%;
  position: absolute;
  width: 100%;

  h1 {
    color: ${props => props.theme.titleColor};
    font-size: 2.4em;
    font-weight: 700;
    letter-spacing: 3px;
    margin: 0;
    max-width: 550px;
    text-align: center;
    text-transform: uppercase;
  }
`;
