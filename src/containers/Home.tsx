import React, { PureComponent } from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

const StyledRoot = styled.div`
  padding: 10% 5%;
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  font-family: ${props => props.theme.font};
  justify-content: center;
  align-items: flex-start;
  flex-wrap: nowrap;
  box-sizing: border-box;

  & > summary {
    max-width: 550px;

    & h1 {
      color: ${props => props.theme.titleColor};
      font-size: 5em;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 3px;
      margin: 0;
    }

    & p {
      font-weight: 400;
      letter-spacing: .6px;
      line-height: 1.4em;
      color: ${props => props.theme.textColor};
    }
  }
`;

interface Props {
  t: TranslationData;
}

const mapStateToProps = (state: any): Partial<Props> => ({ t: state.intl.messages });
const mapDispatchToProps = (dispatch: any): Partial<Props> => bindActionCreators({ }, dispatch);

class Home extends PureComponent<Props> {
  render() {
    const { t } = this.props;

    return (
      <StyledRoot>
        <summary>
          <h1>{t[`hello`]}</h1>
          <p>{t[`description`]}</p>
        </summary>
      </StyledRoot>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
