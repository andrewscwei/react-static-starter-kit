import { changeLocale } from '@/reducers/i18n';
import { Translations } from '@/types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

const mapStateToProps = (state): Partial<Props> => ({ t: state.i18n.messages });
const mapDispatchToProps = (dispatch): Partial<Props> => bindActionCreators({ changeLocale: changeLocale }, dispatch);

const Root = styled.div`
  padding: 10% 5%;
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: nowrap;
  color: #fff;
  box-sizing: border-box;

  & > summary {
    max-width: 550px;

    & > h1 {
      font-size: 2.4em;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 3px;
      margin: 0;
    }
  }
`;

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
          <Root>
            <summary>
              <h1>{t[`not-found`]}</h1>
            </summary>
          </Root>
        );
      } }/>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotFound);
